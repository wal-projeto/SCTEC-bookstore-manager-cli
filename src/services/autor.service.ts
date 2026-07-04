import { Autor } from '../models/autor.model'
import { NotFoundError } from '../errors/not-found.error'
import { ValidationError } from '../errors/validation.error'
import {
  AutorRepository,
  CreateAutorInput,
  UpdateAutorInput
} from '../repositories/autor.repository'
import { isBlank, isValidCpf } from '../utils/validators.util'

export class AutorService {
  constructor(private readonly repository: AutorRepository) {}

  async create(input: CreateAutorInput): Promise<Autor> {
    if (isBlank(input.nome)) {
      throw new ValidationError('O nome do autor é obrigatório.')
    }
    if (input.cpf && !isValidCpf(input.cpf)) {
      throw new ValidationError('CPF inválido. Informe 11 dígitos numéricos.')
    }

    return this.repository.create(input)
  }

  async list(): Promise<Autor[]> {
    return this.repository.findAll()
  }

  async getById(id: number): Promise<Autor> {
    const autor = await this.repository.findById(id)
    if (!autor) {
      throw new NotFoundError('Autor', id)
    }
    return autor
  }

  async update(id: number, input: UpdateAutorInput): Promise<Autor> {
    if (input.nome !== undefined && isBlank(input.nome)) {
      throw new ValidationError('O nome do autor não pode ficar em branco.')
    }
    if (input.cpf !== undefined && input.cpf && !isValidCpf(input.cpf)) {
      throw new ValidationError('CPF inválido. Informe 11 dígitos numéricos.')
    }

    const updated = await this.repository.update(id, input)
    if (!updated) {
      throw new NotFoundError('Autor', id)
    }
    return updated
  }

  async remove(id: number): Promise<void> {
    const removed = await this.repository.delete(id)
    if (!removed) {
      throw new NotFoundError('Autor', id)
    }
  }
}
