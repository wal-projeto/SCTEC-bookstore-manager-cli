import { Autor } from '../models/autor.model'
import { AutorService } from '../services/autor.service'
import { ReadlineUtil } from '../utils/readline.util'
import { selectFromList } from '../utils/select-from-list.util'

export class AutorController {
  constructor(private readonly service: AutorService) {}

  async create(): Promise<void> {
    const nome = await ReadlineUtil.ask('Nome: ')
    const sobrenome = await ReadlineUtil.ask('Sobrenome (opcional): ')
    const nacionalidade = await ReadlineUtil.ask('Nacionalidade: ')

    const autor = await this.service.create({
      nome,
      sobrenome: sobrenome || undefined,
      nacionalidade: nacionalidade || undefined
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
    const autores = await this.service.list()
    const autor = await selectFromList(autores, (a) => a.nomeCompleto)
    if (!autor) {
      return
    }
    this.print(autor)
  }

  async update(): Promise<void> {
    const autores = await this.service.list()
    const selecionado = await selectFromList(autores, (a) => a.nomeCompleto)
    if (!selecionado) {
      return
    }
    const nome = await ReadlineUtil.ask('Novo nome (ENTER para manter o atual): ')
    const sobrenome = await ReadlineUtil.ask('Novo sobrenome (ENTER para manter o atual): ')
    const nacionalidade = await ReadlineUtil.ask('Nova nacionalidade (ENTER para manter o atual): ')

    const autor = await this.service.update(selecionado.id, {
      nome: nome || undefined,
      sobrenome: sobrenome || undefined,
      nacionalidade: nacionalidade || undefined
    })

    console.log('Autor atualizado com sucesso:')
    this.print(autor)
  }

  async remove(): Promise<void> {
    const autores = await this.service.list()
    const autor = await selectFromList(autores, (a) => a.nomeCompleto)
    if (!autor) {
      return
    }
    await this.service.remove(autor.id)
    console.log('Autor removido com sucesso.')
  }

  private print(autor: Autor): void {
    const nacionalidade = autor.getNacionalidade()
    console.log(`#${autor.id} - ${autor.nomeCompleto}${nacionalidade ? ` | Nacionalidade: ${nacionalidade}` : ''}`)
  }
}
