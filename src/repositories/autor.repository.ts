import { Pool } from 'pg'

import { Autor } from '../models/autor.model'

export interface CreateAutorInput {
  nome: string
  sobrenome?: string
  cpf?: string
  dataNascimento?: Date
}

export type UpdateAutorInput = Partial<CreateAutorInput>

interface AutorRow {
  id: number
  nome: string
  sobrenome: string | null
  cpf: string | null
  data_nascimento: Date | null
}

export class AutorRepository {
  constructor(private readonly pool: Pool) {}

  async create(input: CreateAutorInput): Promise<Autor> {
    const { rows } = await this.pool.query<AutorRow>(
      `INSERT INTO autor (nome, sobrenome, cpf, data_nascimento)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, sobrenome, cpf, data_nascimento`,
      [input.nome, input.sobrenome ?? null, input.cpf ?? null, input.dataNascimento ?? null]
    )
    return this.toModel(rows[0])
  }

  async findAll(): Promise<Autor[]> {
    const { rows } = await this.pool.query<AutorRow>(
      `SELECT id, nome, sobrenome, cpf, data_nascimento FROM autor ORDER BY nome`
    )
    return rows.map((row) => this.toModel(row))
  }

  async findById(id: number): Promise<Autor | null> {
    const { rows } = await this.pool.query<AutorRow>(
      `SELECT id, nome, sobrenome, cpf, data_nascimento FROM autor WHERE id = $1`,
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
       SET nome = $1, sobrenome = $2, cpf = $3, data_nascimento = $4
       WHERE id = $5
       RETURNING id, nome, sobrenome, cpf, data_nascimento`,
      [
        input.nome ?? existing.getNome(),
        input.sobrenome ?? existing.getSobrenome(),
        input.cpf ?? existing.getCpf(),
        input.dataNascimento ?? existing.getDataNascimento(),
        id
      ]
    )
    return this.toModel(rows[0])
  }

  async delete(id: number): Promise<boolean> {
    const { rowCount } = await this.pool.query('DELETE FROM autor WHERE id = $1', [id])
    return (rowCount ?? 0) > 0
  }

  private toModel(row: AutorRow): Autor {
    return new Autor({
      id: row.id,
      nome: row.nome,
      sobrenome: row.sobrenome,
      cpf: row.cpf,
      dataNascimento: row.data_nascimento
    })
  }
}
