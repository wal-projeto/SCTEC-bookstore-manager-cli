import { Autor } from '../models/autor.model'
import { AutorService } from '../services/autor.service'
import { ReadlineUtil } from '../utils/readline.util'

export class AutorController {
  constructor(private readonly service: AutorService) {}

  async create(): Promise<void> {
    const nome = await ReadlineUtil.ask('Nome: ')
    const sobrenome = await ReadlineUtil.ask('Sobrenome (opcional): ')
    const cpf = await ReadlineUtil.ask('CPF - 11 dígitos (opcional): ')
    const dataNascimentoStr = await ReadlineUtil.ask('Data de nascimento AAAA-MM-DD (opcional): ')

    const autor = await this.service.create({
      nome,
      sobrenome: sobrenome || undefined,
      cpf: cpf || undefined,
      dataNascimento: dataNascimentoStr ? new Date(dataNascimentoStr) : undefined
    })

    console.log('Autor cadastrado com sucesso:')
    this.print(autor)
  }

  async list(): Promise<void> {
    const autores = await this.service.list()
    if (autores.length === 0) {
      console.log('Nenhum autor cadastrado.')
      return
    }
    autores.forEach((autor) => this.print(autor))
  }

  async getById(): Promise<void> {
    const id = await ReadlineUtil.askNumber('ID do autor: ')
    const autor = await this.service.getById(id)
    this.print(autor)
  }

  async update(): Promise<void> {
    const id = await ReadlineUtil.askNumber('ID do autor a atualizar: ')
    const nome = await ReadlineUtil.ask('Novo nome (ENTER para manter o atual): ')
    const sobrenome = await ReadlineUtil.ask('Novo sobrenome (ENTER para manter o atual): ')
    const cpf = await ReadlineUtil.ask('Novo CPF (ENTER para manter o atual): ')

    const autor = await this.service.update(id, {
      nome: nome || undefined,
      sobrenome: sobrenome || undefined,
      cpf: cpf || undefined
    })

    console.log('Autor atualizado com sucesso:')
    this.print(autor)
  }

  async remove(): Promise<void> {
    const id = await ReadlineUtil.askNumber('ID do autor a remover: ')
    await this.service.remove(id)
    console.log('Autor removido com sucesso.')
  }

  private print(autor: Autor): void {
    const cpf = autor.getCpf()
    console.log(`#${autor.id} - ${autor.nomeCompleto}${cpf ? ` | CPF: ${cpf}` : ''}`)
  }
}
