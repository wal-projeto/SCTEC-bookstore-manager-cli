import { EmprestimoController } from '../controllers/emprestimo.controller'
import { ReadlineUtil } from '../utils/readline.util'

export class EmprestimoMenu {
  constructor(private readonly controller: EmprestimoController) {}

  async show(): Promise<void> {
    let voltar = false

    while (!voltar) {
      console.log('\n--- Menu Empréstimos ---')
      console.log('1. Registrar empréstimo')
      console.log('2. Listar empréstimos')
      console.log('3. Registrar devolução')
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
            await this.controller.devolver()
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
