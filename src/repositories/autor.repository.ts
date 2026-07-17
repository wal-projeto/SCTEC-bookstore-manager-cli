/** autor.repository é quem utiliza o new Autor(...)
 *
 */

import { Pool } from 'pg'

import { Autor } from '../models/autor.model'
import { ValidationError } from '../errors/validation.error'
import { isForeignKeyViolation } from '../utils/postgres-error.util'

export interface CreateAutorInput {
  nome: string
  sobrenome?: string
  nacionalidade?: string
}

export type UpdateAutorInput = Partial<CreateAutorInput>

interface AutorRow {
  id: number
  nome: string
  sobrenome: string | null
  nacionalidade: string | null
}

export class AutorRepository {
  constructor(private readonly pool: Pool) {}

  async create(input: CreateAutorInput): Promise<Autor> {
    const { rows } = await this.pool.query<AutorRow>(
      `INSERT INTO autor (nome, sobrenome, nacionalidade)
       VALUES ($1, $2, $3)
       RETURNING id, nome, sobrenome, nacionalidade`,
      [input.nome, input.sobrenome ?? null, input.nacionalidade ?? null]
    )
    return this.toModel(rows[0])
  }

  async findAll(): Promise<Autor[]> {
    const { rows } = await this.pool.query<AutorRow>(
      `SELECT id, nome, sobrenome, nacionalidade FROM autor ORDER BY nome`
    )
    return rows.map((row) => this.toModel(row))
  }

  async findById(id: number): Promise<Autor | null> {
    const { rows } = await this.pool.query<AutorRow>(
      `SELECT id, nome, sobrenome, nacionalidade FROM autor WHERE id = $1`,
      [id]
    )
    return rows[0] ? this.toModel(rows[0]) : null
  }

  async update(id: number, input: UpdateAutorInput): Promise<Autor | null> {
    const existing = await this.findById(id)
    if (!existing) {
      return null
    }

    const { rows } = await this.pool.query<AutorRow>(
      `UPDATE autor
       SET nome = $1, sobrenome = $2, nacionalidade = $3
       WHERE id = $4
       RETURNING id, nome, sobrenome, nacionalidade`,
      [
        input.nome ?? existing.getNome(),
        input.sobrenome ?? existing.getSobrenome(),
        input.nacionalidade ?? existing.getNacionalidade(),
        id
      ]
    )
    return this.toModel(rows[0])
  }

  async delete(id: number): Promise<boolean> {
    try {
      const { rowCount } = await this.pool.query(
        'DELETE FROM autor WHERE id = $1',
        [id]
      )
      return (rowCount ?? 0) > 0
    } catch (error) {
      if (isForeignKeyViolation(error, 'livro_autor_id_fkey')) {
        throw new ValidationError('Não é possível remover: existem livros vinculados a este autor.')
      }
      throw error
    }
  }

  private toModel(row: AutorRow): Autor {
    return new Autor({
      id: row.id,
      nome: row.nome,
      sobrenome: row.sobrenome,
      nacionalidade: row.nacionalidade
    })
  }
}
