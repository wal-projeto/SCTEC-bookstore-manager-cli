import { Pool } from 'pg'

import { Cliente } from '../models/cliente.model'
import { ValidationError } from '../errors/validation.error'
import { isForeignKeyViolation, isUniqueViolation } from '../utils/postgres-error.util'

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
    try {
      const { rows } = await this.pool.query<ClienteRow>(
        `INSERT INTO cliente (nome, sobrenome, cpf, email, telefone)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, nome, sobrenome, cpf, email, telefone`,
        [input.nome, input.sobrenome ?? null, input.cpf, input.email ?? null, input.telefone ?? null]
      )
      return this.toModel(rows[0])
    } catch (error) {
      if (isUniqueViolation(error, 'cliente_cpf_key')) {
        throw new ValidationError('Já existe um cliente cadastrado com esse CPF.')
      }
      if (isUniqueViolation(error, 'cliente_email_key')) {
        throw new ValidationError('Já existe um cliente cadastrado com esse email.')
      }
      throw error
    }
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
    try {
      const { rows } = await this.pool.query<ClienteRow>(
        `UPDATE cliente
         SET nome = COALESCE($1, nome),
             sobrenome = COALESCE($2, sobrenome),
             email = COALESCE($3, email),
             telefone = COALESCE($4, telefone)
         WHERE id = $5
         RETURNING id, nome, sobrenome, cpf, email, telefone`,
        [input.nome ?? null, input.sobrenome ?? null, input.email ?? null, input.telefone ?? null, id]
      )
      return rows[0] ? this.toModel(rows[0]) : null
    } catch (error) {
      if (isUniqueViolation(error, 'cliente_email_key')) {
        throw new ValidationError('Já existe um cliente cadastrado com esse email.')
      }
      throw error
    }
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
