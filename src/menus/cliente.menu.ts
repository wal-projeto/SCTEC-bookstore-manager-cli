import { ClienteController } from '../controllers/cliente.controller'
import { ReadlineUtil } from '../utils/readline.util'

export class ClienteMenu {
  constructor(private readonly controller: ClienteController) {}

  async show(): Promise<void> {
    let voltar = false

    while (!voltar) {
      console.log('\n--- Menu Clientes ---')
      console.log('1. Cadastrar cliente')
      console.log('2. Listar clientes')
      console.log('3. Consultar um cliente')
      console.log('4. Atualizar cliente')
      console.log('5. Remover cliente')
      console.log('0. Voltar')

      const opcao = await ReadlineUtil.ask('Escolha uma opção: ')

      try {
        switch (opcao) {
          case '1':
            await this.controller.create()
            break
          case '2':
            await this.controller.list()
            break
          case '3':
            await this.controller.getById()
            break
          case '4':
            await this.controller.update()
            break
          case '5':
            await this.controller.remove()
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
