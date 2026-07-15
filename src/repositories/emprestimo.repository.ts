import { Pool } from 'pg'

import { Emprestimo, StatusEmprestimo } from '../models/emprestimo.model'
import { NotFoundError } from '../errors/not-found.error'
import { ValidationError } from '../errors/validation.error'

export interface CreateEmprestimoInput {
  livroId: number
  clienteId: number
  dataPrevistaDevolucao: Date
}

export interface EmprestimoDetalhado {
  id: number
  livroTitulo: string
  clienteNome: string
  dataEmprestimo: Date
  dataPrevistaDevolucao: Date
  dataDevolucaoReal: Date | null
  status: StatusEmprestimo
}

interface EmprestimoRow {
  id: number
  livro_id: number
  cliente_id: number
  data_emprestimo: Date
  data_prevista_devolucao: Date
  data_devolucao_real: Date | null
  status: StatusEmprestimo
}

interface EmprestimoDetalhadoRow {
  id: number
  livro_titulo: string
  cliente_nome: string
  data_emprestimo: Date
  data_prevista_devolucao: Date
  data_devolucao_real: Date | null
  status: StatusEmprestimo
}

export class EmprestimoRepository {
  constructor(private readonly pool: Pool) {}

  async create(input: CreateEmprestimoInput): Promise<Emprestimo> {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')

      const { rows: livroRows } = await client.query<{ quantidade_disponivel: number }>(
        'SELECT quantidade_disponivel FROM livro WHERE id = $1 FOR UPDATE',
        [input.livroId]
      )
      if (livroRows.length === 0) {
        throw new NotFoundError('Livro', input.livroId)
      }
      if (livroRows[0].quantidade_disponivel <= 0) {
        throw new ValidationError('Este livro não está disponível para empréstimo no momento.')
      }

      const { rows } = await client.query<EmprestimoRow>(
        `INSERT INTO emprestimo (livro_id, cliente_id, data_prevista_devolucao)
         VALUES ($1, $2, $3)
         RETURNING id, livro_id, cliente_id, data_emprestimo, data_prevista_devolucao, data_devolucao_real, status`,
        [input.livroId, input.clienteId, input.dataPrevistaDevolucao]
      )

      await client.query(
        'UPDATE livro SET quantidade_disponivel = quantidade_disponivel - 1 WHERE id = $1',
        [input.livroId]
      )

      await client.query('COMMIT')
      return this.toModel(rows[0])
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async findAllDetalhado(): Promise<EmprestimoDetalhado[]> {
    const { rows } = await this.pool.query<EmprestimoDetalhadoRow>(
      `SELECT e.id, l.titulo AS livro_titulo, c.nome AS cliente_nome,
              e.data_emprestimo, e.data_prevista_devolucao, e.data_devolucao_real, e.status
       FROM emprestimo e
       JOIN livro l ON l.id = e.livro_id
       JOIN cliente c ON c.id = e.cliente_id
       ORDER BY e.data_emprestimo DESC`
    )
    return rows.map((row) => ({
      id: row.id,
      livroTitulo: row.livro_titulo,
      clienteNome: row.cliente_nome,
      dataEmprestimo: row.data_emprestimo,
      dataPrevistaDevolucao: row.data_prevista_devolucao,
      dataDevolucaoReal: row.data_devolucao_real,
      status: row.status
    }))
  }

  async findById(id: number): Promise<Emprestimo | null> {
    const { rows } = await this.pool.query<EmprestimoRow>(
      `SELECT id, livro_id, cliente_id, data_emprestimo, data_prevista_devolucao, data_devolucao_real, status
       FROM emprestimo WHERE id = $1`,
      [id]
    )
    return rows[0] ? this.toModel(rows[0]) : null
  }

  async registrarDevolucao(id: number): Promise<Emprestimo> {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')

      const { rows } = await client.query<EmprestimoRow>(
        `SELECT id, livro_id, cliente_id, data_emprestimo, data_prevista_devolucao, data_devolucao_real, status
         FROM emprestimo WHERE id = $1 FOR UPDATE`,
        [id]
      )
      if (rows.length === 0) {
        throw new NotFoundError('Empréstimo', id)
      }
      if (rows[0].status === 'devolvido') {
        throw new ValidationError('Este empréstimo já foi devolvido.')
      }

      const { rows: updatedRows } = await client.query<EmprestimoRow>(
        `UPDATE emprestimo
         SET status = 'devolvido', data_devolucao_real = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING id, livro_id, cliente_id, data_emprestimo, data_prevista_devolucao, data_devolucao_real, status`,
        [id]
      )

      await client.query(
        'UPDATE livro SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id = $1',
        [rows[0].livro_id]
      )

      await client.query('COMMIT')
      return this.toModel(updatedRows[0])
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  private toModel(row: EmprestimoRow): Emprestimo {
    return new Emprestimo({
      id: row.id,
      livroId: row.livro_id,
      clienteId: row.cliente_id,
      dataEmprestimo: row.data_emprestimo,
      dataPrevistaDevolucao: row.data_prevista_devolucao,
      dataDevolucaoReal: row.data_devolucao_real,
      status: row.status
    })
  }
}
