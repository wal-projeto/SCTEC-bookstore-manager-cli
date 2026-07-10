import { AutorController } from '../controllers/autor.controller'
import { ReadlineUtil } from '../utils/readline.util'

export class AutorMenu {
  constructor(private readonly controller: AutorController) {}

  async show(): Promise<void> {
    let voltar = false

    while (!voltar) {
      console.log('\n--- Menu Autores ---')
      console.log('1. Cadastrar autor')
      console.log('2. Listar autores')
      console.log('3. Consultar um autor')
      console.log('4. Atualizar autor')
      console.log('5. Remover autor')
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
