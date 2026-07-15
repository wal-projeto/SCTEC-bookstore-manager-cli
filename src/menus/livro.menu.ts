import { LivroController } from '../controllers/livro.controller'
import { ReadlineUtil } from '../utils/readline.util'

export class LivroMenu {
  constructor(private readonly controller: LivroController) {}

  async show(): Promise<void> {
    let voltar = false

    while (!voltar) {
      console.log('\n--- Menu Livros ---')
      console.log('1. Cadastrar livro')
      console.log('2. Listar livros')
      console.log('3. Consultar um livro')
      console.log('4. Atualizar livro')
      console.log('5. Remover livro')
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
