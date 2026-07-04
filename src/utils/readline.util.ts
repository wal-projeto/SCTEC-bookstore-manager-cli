import { createInterface, Interface } from 'node:readline/promises'

export class ReadlineUtil {
  private static instance: Interface = createInterface(process.stdin, process.stdout)

  static async ask(question: string): Promise<string> {
    const answer = await this.instance.question(question)
    return answer.trim()
  }

  static async askNumber(question: string): Promise<number> {
    for (;;) {
      const answer = await this.ask(question)
      const value = Number(answer)
      if (!Number.isNaN(value)) {
        return value
      }
      console.log('Digite um número válido.')
    }
  }

  static close(): void {
    this.instance.close()
  }
}
