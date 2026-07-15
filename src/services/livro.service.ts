import { Livro } from '../models/livro.model'
import { NotFoundError } from '../errors/not-found.error'
import { ValidationError } from '../errors/validation.error'
import {
  LivroRepository,
  CreateLivroInput,
  UpdateLivroInput
} from '../repositories/livro.repository'
import { AutorRepository } from '../repositories/autor.repository'
import { isBlank, isValidIsbn, isValidAno } from '../utils/validators.util'

export class LivroService {
  constructor(
    private readonly repository: LivroRepository,
    private readonly autorRepository: AutorRepository
  ) {}

  async existsByTitulo(titulo: string): Promise<boolean> {
    const existente = await this.repository.findByTitulo(titulo)
    return existente !== null
  }

  async create(input: CreateLivroInput): Promise<Livro> {
    if (isBlank(input.titulo)) {
      throw new ValidationError('O título do livro é obrigatório.')
    }
    if (await this.existsByTitulo(input.titulo)) {
      throw new ValidationError('Já existe um livro cadastrado com esse título.')
    }
    if (input.isbn !== undefined && !isValidIsbn(input.isbn)) {
      throw new ValidationError('ISBN inválido. Use 10 ou 13 dígitos (ISBN-10 pode terminar em X).')
    }
    if (input.anoPublicacao !== undefined && !isValidAno(input.anoPublicacao)) {
      throw new ValidationError('Ano de publicação inválido.')
    }
    if (input.quantidadeTotal !== undefined && (!Number.isInteger(input.quantidadeTotal) || input.quantidadeTotal < 1)) {
      throw new ValidationError('A quantidade total deve ser um número inteiro maior ou igual a 1.')
    }

    const autor = await this.autorRepository.findById(input.autorId)
    if (!autor) {
      throw new NotFoundError('Autor', input.autorId)
    }

    return this.repository.create(input)
  }

  async list(): Promise<Livro[]> {
    return this.repository.findAll()
  }

  async getById(id: number): Promise<Livro> {
    const livro = await this.repository.findById(id)
    if (!livro) {
      throw new NotFoundError('Livro', id)
    }
    return livro
  }

  async update(id: number, input: UpdateLivroInput): Promise<Livro> {
    if (input.titulo !== undefined && isBlank(input.titulo)) {
      throw new ValidationError('O título do livro não pode ficar em branco.')
    }
    if (input.isbn !== undefined && !isValidIsbn(input.isbn)) {
      throw new ValidationError('ISBN inválido. Use 10 ou 13 dígitos (ISBN-10 pode terminar em X).')
    }
    if (input.anoPublicacao !== undefined && !isValidAno(input.anoPublicacao)) {
      throw new ValidationError('Ano de publicação inválido.')
    }
    if (input.quantidadeTotal !== undefined && (!Number.isInteger(input.quantidadeTotal) || input.quantidadeTotal < 1)) {
      throw new ValidationError('A quantidade total deve ser um número inteiro maior ou igual a 1.')
    }
    if (input.autorId !== undefined) {
      const autor = await this.autorRepository.findById(input.autorId)
      if (!autor) {
        throw new NotFoundError('Autor', input.autorId)
      }
    }

    const updated = await this.repository.update(id, input)
    if (!updated) {
      throw new NotFoundError('Livro', id)
    }
    return updated
  }

  async remove(id: number): Promise<void> {
    const removed = await this.repository.delete(id)
    if (!removed) {
      throw new NotFoundError('Livro', id)
    }
  }
}
