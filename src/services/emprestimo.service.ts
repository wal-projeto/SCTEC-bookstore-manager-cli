import { Emprestimo } from '../models/emprestimo.model'
import { NotFoundError } from '../errors/not-found.error'
import { ValidationError } from '../errors/validation.error'
import { EmprestimoRepository, EmprestimoDetalhado } from '../repositories/emprestimo.repository'
import { LivroRepository } from '../repositories/livro.repository'
import { ClienteRepository } from '../repositories/cliente.repository'

const PRAZO_PADRAO_DIAS = 14

export interface CreateEmprestimoInput {
  livroId: number
  clienteId: number
}

export class EmprestimoService {
  constructor(
    private readonly repository: EmprestimoRepository,
    private readonly livroRepository: LivroRepository,
    private readonly clienteRepository: ClienteRepository
  ) {}

  async create(input: CreateEmprestimoInput): Promise<Emprestimo> {
    const livro = await this.livroRepository.findById(input.livroId)
    if (!livro) {
      throw new NotFoundError('Livro', input.livroId)
    }
    if (!livro.estaDisponivel) {
      throw new ValidationError('Este livro não está disponível para empréstimo no momento.')
    }

    const cliente = await this.clienteRepository.findById(input.clienteId)
    if (!cliente) {
      throw new NotFoundError('Cliente', input.clienteId)
    }

    const dataPrevistaDevolucao = new Date(Date.now() + PRAZO_PADRAO_DIAS * 24 * 60 * 60 * 1000)

    return this.repository.create({
      livroId: input.livroId,
      clienteId: input.clienteId,
      dataPrevistaDevolucao
    })
  }

  async list(): Promise<EmprestimoDetalhado[]> {
    return this.repository.findAllDetalhado()
  }

  async getById(id: number): Promise<Emprestimo> {
    const emprestimo = await this.repository.findById(id)
    if (!emprestimo) {
      throw new NotFoundError('Empréstimo', id)
    }
    return emprestimo
  }

  async registrarDevolucao(id: number): Promise<Emprestimo> {
    return this.repository.registrarDevolucao(id)
  }
}
