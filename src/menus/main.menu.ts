import { AutorMenu } from './autor.menu'
import { LivroMenu } from './livro.menu'
import { ClienteMenu } from './cliente.menu'
import { EmprestimoMenu } from './emprestimo.menu'
import { RelatorioMenu } from './relatorio.menu'
import { ReadlineUtil } from '../utils/readline.util'

export class MainMenu {
  constructor(
    private readonly autorMenu: AutorMenu,
    private readonly livroMenu: LivroMenu,
    private readonly clienteMenu: ClienteMenu,
    private readonly emprestimoMenu: EmprestimoMenu,
    private readonly relatorioMenu: RelatorioMenu
  ) {}

  async start(): Promise<void> {
    let sair = false

    while (!sair) {
      console.log('\n=== BookStore Manager CLI ===')
      console.log('1. Autores')
      console.log('2. Livros')
      console.log('3. Clientes')
      console.log('4. Empréstimos')
      console.log('5. Relatórios')
      console.log('0. Encerrar aplicação')

      const opcao = await ReadlineUtil.ask('Escolha uma opção: ')

      switch (opcao) {
        case '1':
          await this.autorMenu.show()
          break
        case '2':
          await this.livroMenu.show()
          break
        case '3':
          await this.clienteMenu.show()
          break
        case '4':
          await this.emprestimoMenu.show()
          break
        case '5':
          await this.relatorioMenu.show()
          break
        case '0':
          sair = true
          break
        default:
          console.log('Opção inválida ou ainda não implementada.')
      }
    }
  }
}
