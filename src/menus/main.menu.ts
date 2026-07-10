import { AutorMenu } from './autor.menu'
import { ReadlineUtil } from '../utils/readline.util'

export class MainMenu {
  constructor(private readonly autorMenu: AutorMenu) {}

  async start(): Promise<void> {
    let sair = false

    while (!sair) {
      console.log('\n=== BookStore Manager CLI ===')
      console.log('1. Autores')
      console.log('2. Livros (em breve)')
      console.log('3. Clientes (em breve)')
      console.log('4. Empréstimos (em breve)')
      console.log('5. Relatórios (em breve)')
      console.log('0. Encerrar aplicação')

      const opcao = await ReadlineUtil.ask('Escolha uma opção: ')

      switch (opcao) {
        case '1':
          await this.autorMenu.show()
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
