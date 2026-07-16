import { RelatorioRepository } from '../repositories/relatorio.repository'

export class RelatorioController {
  constructor(private readonly repository: RelatorioRepository) {}

  async livrosDisponiveis(): Promise<void> {
    const livros = await this.repository.livrosDisponiveis()
    if (livros.length === 0) {
      console.log('Nenhum livro disponível no momento.')
      return
    }
    livros.forEach((livro) => {
      console.log(`${livro.titulo} - ${livro.autorNome} | Disponível: ${livro.quantidadeDisponivel}/${livro.quantidadeTotal}`)
    })
  }

  async livrosEmprestados(): Promise<void> {
    const emprestimos = await this.repository.livrosEmprestados()
    if (emprestimos.length === 0) {
      console.log('Nenhum livro emprestado no momento.')
      return
    }
    emprestimos.forEach((emprestimo) => {
      console.log(
        `${emprestimo.livroTitulo} | Cliente: ${emprestimo.clienteNome}` +
        ` | Emprestado em: ${this.formatDate(emprestimo.dataEmprestimo)}` +
        ` | Prazo: ${this.formatDate(emprestimo.dataPrevistaDevolucao)}`
      )
    })
  }

  async livrosPorAutor(): Promise<void> {
    const autores = await this.repository.livrosPorAutor()
    if (autores.length === 0) {
      console.log('Nenhum autor cadastrado.')
      return
    }
    autores.forEach((autor) => {
      console.log(`${autor.autorNome}: ${autor.titulos ?? '(nenhum livro cadastrado)'}`)
    })
  }

  async emprestimosPorLivro(): Promise<void> {
    const livros = await this.repository.emprestimosPorLivro()
    if (livros.length === 0) {
      console.log('Nenhum livro cadastrado.')
      return
    }
    livros.forEach((livro) => {
      console.log(`${livro.livroTitulo} - ${livro.quantidadeEmprestimos} empréstimo(s)`)
    })
  }

  async clientesComEmprestimoAtivo(): Promise<void> {
    const clientes = await this.repository.clientesComEmprestimoAtivo()
    if (clientes.length === 0) {
      console.log('Nenhum cliente com empréstimo ativo no momento.')
      return
    }
    clientes.forEach((cliente) => {
      console.log(`${cliente.clienteNome} - ${cliente.quantidadeAtiva} empréstimo(s) ativo(s)`)
    })
  }

  async emprestimosAtrasados(): Promise<void> {
    const emprestimos = await this.repository.emprestimosAtrasados()
    if (emprestimos.length === 0) {
      console.log('Nenhum empréstimo atrasado no momento.')
      return
    }
    emprestimos.forEach((emprestimo) => {
      console.log(
        `${emprestimo.livroTitulo} | Cliente: ${emprestimo.clienteNome}` +
        ` | Prazo: ${this.formatDate(emprestimo.dataPrevistaDevolucao)}` +
        ` | Atraso: ${emprestimo.diasAtraso} dia(s)`
      )
    })
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR')
  }
}
