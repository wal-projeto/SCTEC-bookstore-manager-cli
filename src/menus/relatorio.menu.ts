import { RelatorioController } from '../controllers/relatorio.controller'
import { ReadlineUtil } from '../utils/readline.util'

export class RelatorioMenu {
  constructor(private readonly controller: RelatorioController) {}

  async show(): Promise<void> {
    let voltar = false

    while (!voltar) {
      console.log('\n--- Menu Relatórios ---')
      console.log('1. Livros disponíveis')
      console.log('2. Livros emprestados')
      console.log('3. Livros cadastrados por autor')
      console.log('4. Top 10 livros mais emprestados')
      console.log('5. Clientes com empréstimos ativos')
      console.log('6. Empréstimos atrasados')
      console.log('0. Voltar')

      const opcao = await ReadlineUtil.ask('Escolha uma opção: ')

      try {
        switch (opcao) {
          case '1':
            await this.controller.livrosDisponiveis()
            break
          case '2':
            await this.controller.livrosEmprestados()
            break
          case '3':
            await this.controller.livrosPorAutor()
            break
          case '4':
            await this.controller.emprestimosPorLivro()
            break
          case '5':
            await this.controller.clientesComEmprestimoAtivo()
            break
          case '6':
            await this.controller.emprestimosAtrasados()
            break
          case '0':
            voltar = true
            break
          default:
            console.log('Opção inválida.')
        }
      } catch (error) {
        this.handleError(error)
      }
    }
  }

  private handleError(error: unknown): void {
    if (error instanceof Error) {
      console.log(`Erro: ${error.message}`)
      return
    }
    console.log('Ocorreu um erro inesperado.')
  }
}
