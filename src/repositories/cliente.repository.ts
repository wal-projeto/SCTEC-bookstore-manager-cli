import { Pool } from 'pg'

import { Cliente } from '../models/cliente.model'
import { ValidationError } from '../errors/validation.error'
import { isForeignKeyViolation } from '../utils/postgres-error.util'

export interface CreateClienteInput {
  nome: string
  sobrenome?: string
  cpf: string
  email?: string
  telefone?: string
}

export type UpdateClienteInput = Partial<Omit<CreateClienteInput, 'cpf'>>

interface ClienteRow {
  id: number
  nome: string
  sobrenome: string | null
  cpf: string
  email: string | null
  telefone: string | null
}

export class ClienteRepository {
  constructor(private readonly pool: Pool) {}

  async create(input: CreateClienteInput): Promise<Cliente> {
    const { rows } = await this.pool.query<ClienteRow>(
      `INSERT INTO cliente (nome, sobrenome, cpf, email, telefone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nome, sobrenome, cpf, email, telefone`,
      [input.nome, input.sobrenome ?? null, input.cpf, input.email ?? null, input.telefone ?? null]
    )
    return this.toModel(rows[0])
  }

  async findAll(): Promise<Cliente[]> {
    const { rows } = await this.pool.query<ClienteRow>(
      `SELECT id, nome, sobrenome, cpf, email, telefone FROM cliente ORDER BY nome`
    )
    return rows.map((row) => this.toModel(row))
  }

  async findById(id: number): Promise<Cliente | null> {
    const { rows } = await this.pool.query<ClienteRow>(
      `SELECT id, nome, sobrenome, cpf, email, telefone FROM cliente WHERE id = $1`,
      [id]
    )
    return rows[0] ? this.toModel(rows[0]) : null
  }

  async findByCpf(cpf: string): Promise<Cliente | null> {
    const { rows } = await this.pool.query<ClienteRow>(
      `SELECT id, nome, sobrenome, cpf, email, telefone FROM cliente WHERE cpf = $1`,
      [cpf]
    )
    return rows[0] ? this.toModel(rows[0]) : null
  }

  async findByEmail(email: string): Promise<Cliente | null> {
    const { rows } = await this.pool.query<ClienteRow>(
      `SELECT id, nome, sobrenome, cpf, email, telefone FROM cliente WHERE LOWER(email) = LOWER($1)`,
      [email]
    )
    return rows[0] ? this.toModel(rows[0]) : null
  }

  async update(id: number, input: UpdateClienteInput): Promise<Cliente | null> {
    const existing = await this.findById(id)
    if (!existing) {
      return null
    }

    const { rows } = await this.pool.query<ClienteRow>(
      `UPDATE cliente
       SET nome = $1, sobrenome = $2, email = $3, telefone = $4
       WHERE id = $5
       RETURNING id, nome, sobrenome, cpf, email, telefone`,
      [
        input.nome ?? existing.getNome(),
        input.sobrenome ?? existing.getSobrenome(),
        input.email ?? existing.getEmail(),
        input.telefone ?? existing.getTelefone(),
        id
      ]
    )
    return this.toModel(rows[0])
  }

  async delete(id: number): Promise<boolean> {
    try {
      const { rowCount } = await this.pool.query(
        'DELETE FROM cliente WHERE id = $1',
        [id]
      )
      return (rowCount ?? 0) > 0
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        throw new ValidationError('Não é possível remover: existem empréstimos vinculados a este cliente.')
      }
      throw error
    }
  }

  private toModel(row: ClienteRow): Cliente {
    return new Cliente({
      id: row.id,
      nome: row.nome,
      sobrenome: row.sobrenome,
      cpf: row.cpf,
      email: row.email,
      telefone: row.telefone
    })
  }
}
