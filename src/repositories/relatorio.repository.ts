import { Pool } from 'pg'

export interface LivroDisponivel {
  titulo: string
  autorNome: string
  quantidadeDisponivel: number
  quantidadeTotal: number
}

export interface LivroEmprestado {
  livroTitulo: string
  clienteNome: string
  dataEmprestimo: Date
  dataPrevistaDevolucao: Date
}

export interface LivrosPorAutor {
  autorNome: string
  titulos: string | null
}

export interface EmprestimosPorLivro {
  livroTitulo: string
  quantidadeEmprestimos: number
}

export interface ClienteComEmprestimoAtivo {
  clienteNome: string
  quantidadeAtiva: number
}

export interface EmprestimoAtrasado {
  livroTitulo: string
  clienteNome: string
  dataPrevistaDevolucao: Date
  diasAtraso: number
}

export class RelatorioRepository {
  constructor(private readonly pool: Pool) {}

  async livrosDisponiveis(): Promise<LivroDisponivel[]> {
    const { rows } = await this.pool.query<{
      titulo: string
      autor_nome: string
      quantidade_disponivel: number
      quantidade_total: number
    }>(
      `SELECT l.titulo, CONCAT_WS(' ', a.nome, a.sobrenome) AS autor_nome,
              l.quantidade_disponivel, l.quantidade_total
       FROM livro l
       INNER JOIN autor a ON a.id = l.autor_id
       WHERE l.quantidade_disponivel > 0
       ORDER BY l.titulo`
    )
    return rows.map((row) => ({
      titulo: row.titulo,
      autorNome: row.autor_nome,
      quantidadeDisponivel: row.quantidade_disponivel,
      quantidadeTotal: row.quantidade_total
    }))
  }

  async livrosEmprestados(): Promise<LivroEmprestado[]> {
    const { rows } = await this.pool.query<{
      livro_titulo: string
      cliente_nome: string
      data_emprestimo: Date
      data_prevista_devolucao: Date
    }>(
      `SELECT l.titulo AS livro_titulo, CONCAT_WS(' ', c.nome, c.sobrenome) AS cliente_nome,
              e.data_emprestimo, e.data_prevista_devolucao
       FROM emprestimo e
       INNER JOIN livro l ON l.id = e.livro_id
       INNER JOIN cliente c ON c.id = e.cliente_id
       WHERE e.status = 'ativo'
       ORDER BY e.data_emprestimo DESC`
    )
    return rows.map((row) => ({
      livroTitulo: row.livro_titulo,
      clienteNome: row.cliente_nome,
      dataEmprestimo: row.data_emprestimo,
      dataPrevistaDevolucao: row.data_prevista_devolucao
    }))
  }

  async livrosPorAutor(): Promise<LivrosPorAutor[]> {
    const { rows } = await this.pool.query<{ autor_nome: string; titulos: string | null }>(
      `SELECT CONCAT_WS(' ', a.nome, a.sobrenome) AS autor_nome,
              STRING_AGG(l.titulo, ', ' ORDER BY l.titulo) AS titulos
       FROM autor a
       LEFT JOIN livro l ON l.autor_id = a.id
       GROUP BY a.id, a.nome, a.sobrenome
       ORDER BY a.nome`
    )
    return rows.map((row) => ({
      autorNome: row.autor_nome,
      titulos: row.titulos
    }))
  }

  async emprestimosPorLivro(): Promise<EmprestimosPorLivro[]> {
    const { rows } = await this.pool.query<{ livro_titulo: string; quantidade_emprestimos: string }>(
      `SELECT l.titulo AS livro_titulo, COUNT(e.id) AS quantidade_emprestimos
       FROM livro l
       LEFT JOIN emprestimo e ON e.livro_id = l.id
       GROUP BY l.id, l.titulo
       ORDER BY quantidade_emprestimos DESC, l.titulo
       LIMIT 10`
    )
    return rows.map((row) => ({
      livroTitulo: row.livro_titulo,
      quantidadeEmprestimos: Number(row.quantidade_emprestimos)
    }))
  }

  async clientesComEmprestimoAtivo(): Promise<ClienteComEmprestimoAtivo[]> {
    const { rows } = await this.pool.query<{ cliente_nome: string; quantidade_ativa: string }>(
      `SELECT CONCAT_WS(' ', c.nome, c.sobrenome) AS cliente_nome, COUNT(e.id) AS quantidade_ativa
       FROM cliente c
       INNER JOIN emprestimo e ON e.cliente_id = c.id
       WHERE e.status = 'ativo'
       GROUP BY c.id, c.nome, c.sobrenome
       ORDER BY quantidade_ativa DESC, c.nome`
    )
    return rows.map((row) => ({
      clienteNome: row.cliente_nome,
      quantidadeAtiva: Number(row.quantidade_ativa)
    }))
  }

  async emprestimosAtrasados(): Promise<EmprestimoAtrasado[]> {
    const { rows } = await this.pool.query<{
      livro_titulo: string
      cliente_nome: string
      data_prevista_devolucao: Date
      dias_atraso: number
    }>(
      `SELECT l.titulo AS livro_titulo, CONCAT_WS(' ', c.nome, c.sobrenome) AS cliente_nome,
              e.data_prevista_devolucao,
              (CURRENT_DATE - e.data_prevista_devolucao::date) AS dias_atraso
       FROM emprestimo e
       INNER JOIN livro l ON l.id = e.livro_id
       INNER JOIN cliente c ON c.id = e.cliente_id
       WHERE e.status = 'ativo' AND e.data_prevista_devolucao < CURRENT_TIMESTAMP
       ORDER BY dias_atraso DESC`
    )
    return rows.map((row) => ({
      livroTitulo: row.livro_titulo,
      clienteNome: row.cliente_nome,
      dataPrevistaDevolucao: row.data_prevista_devolucao,
      diasAtraso: row.dias_atraso
    }))
  }
}
