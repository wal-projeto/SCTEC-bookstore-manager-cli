import { Pool } from 'pg'

import { Livro } from '../models/livro.model'
import { NotFoundError } from '../errors/not-found.error'
import { ValidationError } from '../errors/validation.error'
import { isForeignKeyViolation, isUniqueViolation } from '../utils/postgres-error.util'

export interface CreateLivroInput {
  autorId: number
  titulo: string
  genero?: string
  anoPublicacao?: number
  isbn?: string
  quantidadeTotal?: number
}

export type UpdateLivroInput = Partial<CreateLivroInput>

interface LivroRow {
  id: number
  autor_id: number
  titulo: string
  genero: string | null
  ano_publicacao: number | null
  isbn: string | null
  quantidade_total: number
  quantidade_disponivel: number
}

export class LivroRepository {
  constructor(private readonly pool: Pool) {}

  async create(input: CreateLivroInput): Promise<Livro> {
    const quantidadeTotal = input.quantidadeTotal ?? 1
    try {
      const { rows } = await this.pool.query<LivroRow>(
        `INSERT INTO livro (autor_id, titulo, genero, ano_publicacao, isbn, quantidade_total, quantidade_disponivel)
         VALUES ($1, $2, $3, $4, $5, $6, $6)
         RETURNING id, autor_id, titulo, genero, ano_publicacao, isbn, quantidade_total, quantidade_disponivel`,
        [
          input.autorId,
          input.titulo,
          input.genero ?? null,
          input.anoPublicacao ?? null,
          input.isbn ?? null,
          quantidadeTotal
        ]
      )
      return this.toModel(rows[0])
    } catch (error) {
      this.ensureIsbnNaoDuplicado(error)
      if (isForeignKeyViolation(error, 'livro_autor_id_fkey')) {
        throw new NotFoundError('Autor', input.autorId)
      }
      throw error
    }
  }

  async findAll(): Promise<Livro[]> {
    const { rows } = await this.pool.query<LivroRow>(
      `SELECT id, autor_id, titulo, genero, ano_publicacao, isbn, quantidade_total, quantidade_disponivel
       FROM livro ORDER BY titulo`
    )
    return rows.map((row) => this.toModel(row))
  }

  async findById(id: number): Promise<Livro | null> {
    const { rows } = await this.pool.query<LivroRow>(
      `SELECT id, autor_id, titulo, genero, ano_publicacao, isbn, quantidade_total, quantidade_disponivel
       FROM livro WHERE id = $1`,
      [id]
    )
    return rows[0] ? this.toModel(rows[0]) : null
  }

  async findByTitulo(titulo: string): Promise<Livro | null> {
    const { rows } = await this.pool.query<LivroRow>(
      `SELECT id, autor_id, titulo, genero, ano_publicacao, isbn, quantidade_total, quantidade_disponivel
       FROM livro WHERE LOWER(titulo) = LOWER($1)`,
      [titulo.trim()]
    )
    return rows[0] ? this.toModel(rows[0]) : null
  }

  async update(id: number, input: UpdateLivroInput): Promise<Livro | null> {
    const existing = await this.findById(id)
    if (!existing) {
      return null
    }

    const quantidadeTotal = input.quantidadeTotal ?? existing.getQuantidadeTotal()
    const emprestados = existing.getQuantidadeTotal() - existing.getQuantidadeDisponivel()
    const quantidadeDisponivel = quantidadeTotal - emprestados

    if (quantidadeDisponivel < 0) {
      throw new ValidationError(
        `Não é possível reduzir a quantidade total para ${quantidadeTotal}: existem ${emprestados} exemplar(es) emprestado(s) no momento.`
      )
    }

    try {
      const { rows } = await this.pool.query<LivroRow>(
        `UPDATE livro
         SET autor_id = $1, titulo = $2, genero = $3, ano_publicacao = $4, isbn = $5, quantidade_total = $6, quantidade_disponivel = $7
         WHERE id = $8
         RETURNING id, autor_id, titulo, genero, ano_publicacao, isbn, quantidade_total, quantidade_disponivel`,
        [
          input.autorId ?? existing.getAutorId(),
          input.titulo ?? existing.getTitulo(),
          input.genero ?? existing.getGenero(),
          input.anoPublicacao ?? existing.getAnoPublicacao(),
          input.isbn ?? existing.getIsbn(),
          quantidadeTotal,
          quantidadeDisponivel,
          id
        ]
      )
      return this.toModel(rows[0])
    } catch (error) {
      this.ensureIsbnNaoDuplicado(error)
      if (isForeignKeyViolation(error, 'livro_autor_id_fkey')) {
        throw new NotFoundError('Autor', input.autorId ?? existing.getAutorId())
      }
      throw error
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const { rowCount } = await this.pool.query(
        'DELETE FROM livro WHERE id = $1',
        [id]
      )
      return (rowCount ?? 0) > 0
    } catch (error) {
      if (isForeignKeyViolation(error, 'emprestimo_livro_id_fkey')) {
        throw new ValidationError('Não é possível remover: existem empréstimos vinculados a este livro.')
      }
      throw error
    }
  }

  private ensureIsbnNaoDuplicado(error: unknown): void {
    if (isUniqueViolation(error, 'livro_isbn_key')) {
      throw new ValidationError('Já existe um livro cadastrado com esse ISBN.')
    }
  }

  private toModel(row: LivroRow): Livro {
    return new Livro({
      id: row.id,
      autorId: row.autor_id,
      titulo: row.titulo,
      genero: row.genero,
      anoPublicacao: row.ano_publicacao,
      isbn: row.isbn,
      quantidadeTotal: row.quantidade_total,
      quantidadeDisponivel: row.quantidade_disponivel
    })
  }
}
