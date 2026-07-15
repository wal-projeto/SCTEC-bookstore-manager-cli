import { Cliente } from '../models/cliente.model'
import { NotFoundError } from '../errors/not-found.error'
import { ValidationError } from '../errors/validation.error'
import {
  ClienteRepository,
  CreateClienteInput,
  UpdateClienteInput
} from '../repositories/cliente.repository'
import { isBlank, isValidNome, isValidCpf, isValidEmail } from '../utils/validators.util'

export class ClienteService {
  constructor(private readonly repository: ClienteRepository) {}

  async existsByCpf(cpf: string): Promise<boolean> {
    const existente = await this.repository.findByCpf(cpf)
    return existente !== null
  }

  async create(input: CreateClienteInput): Promise<Cliente> {
    if (isBlank(input.nome)) {
      throw new ValidationError('O nome do cliente é obrigatório.')
    }
    if (!isValidNome(input.nome)) {
      throw new ValidationError('Nome inválido. Use apenas letras, espaço, apóstrofo ou hífen.')
    }
    if (isBlank(input.cpf)) {
      throw new ValidationError('O CPF do cliente é obrigatório.')
    }
    if (!isValidCpf(input.cpf)) {
      throw new ValidationError('CPF inválido. Use 11 dígitos numéricos.')
    }
    if (await this.existsByCpf(input.cpf)) {
      throw new ValidationError('Já existe um cliente cadastrado com esse CPF.')
    }

    const email = input.email !== undefined ? input.email.trim().toLowerCase() : undefined
    if (email !== undefined) {
      if (!isValidEmail(email)) {
        throw new ValidationError('Email inválido.')
      }
      const existente = await this.repository.findByEmail(email)
      if (existente) {
        throw new ValidationError('Já existe um cliente cadastrado com esse email.')
      }
    }

    return this.repository.create({ ...input, email })
  }

  async list(): Promise<Cliente[]> {
    return this.repository.findAll()
  }

  async getById(id: number): Promise<Cliente> {
    const cliente = await this.repository.findById(id)
    if (!cliente) {
      throw new NotFoundError('Cliente', id)
    }
    return cliente
  }

  async update(id: number, input: UpdateClienteInput): Promise<Cliente> {
    if (input.nome !== undefined && isBlank(input.nome)) {
      throw new ValidationError('O nome do cliente não pode ficar em branco.')
    }
    if (input.nome !== undefined && !isValidNome(input.nome)) {
      throw new ValidationError('Nome inválido. Use apenas letras, espaço, apóstrofo ou hífen.')
    }
    const email = input.email !== undefined ? input.email.trim().toLowerCase() : undefined
    if (email !== undefined) {
      if (!isValidEmail(email)) {
        throw new ValidationError('Email inválido.')
      }
      const existente = await this.repository.findByEmail(email)
      if (existente && existente.id !== id) {
        throw new ValidationError('Já existe um cliente cadastrado com esse email.')
      }
    }

    const updated = await this.repository.update(id, { ...input, email })
    if (!updated) {
      throw new NotFoundError('Cliente', id)
    }
    return updated
  }

  async remove(id: number): Promise<void> {
    const removed = await this.repository.delete(id)
    if (!removed) {
      throw new NotFoundError('Cliente', id)
    }
  }
}
