import { Autor } from '../models/autor.model'
import { Livro } from '../models/livro.model'
import { AutorService } from '../services/autor.service'
import { LivroService } from '../services/livro.service'
import { ReadlineUtil } from '../utils/readline.util'
import { selectFromList } from '../utils/select-from-list.util'

export class LivroController {
  constructor(
    private readonly service: LivroService,
    private readonly autorService: AutorService
  ) {}

  async create(): Promise<void> {
    const titulo = await ReadlineUtil.ask('Título: ')

    if (await this.service.existsByTitulo(titulo)) {
      console.log('Já existe um livro cadastrado com esse título.')
      return
    }

    const autor = await this.pickAutor()
    if (!autor) {
      return
    }

    const genero = await ReadlineUtil.ask('Gênero (opcional): ')
    const isbn = await ReadlineUtil.ask('ISBN (opcional): ')
    const anoTexto = await ReadlineUtil.ask('Ano de publicação (opcional): ')
    const quantidadeTexto = await ReadlineUtil.ask('Quantidade de exemplares (opcional, padrão 1): ')

    const livro = await this.service.create({
      autorId: autor.id,
      titulo,
      genero: genero || undefined,
      isbn: isbn || undefined,
      anoPublicacao: anoTexto ? Number(anoTexto) : undefined,
      quantidadeTotal: quantidadeTexto ? Number(quantidadeTexto) : undefined
    })

    console.log('Livro cadastrado com sucesso:')
    this.print(livro)
  }

  async list(): Promise<void> {
    const livros = await this.service.list()
    if (livros.length === 0) {
      console.log('Nenhum livro cadastrado.')
      return
    }
    livros.forEach((livro) => this.print(livro))
  }

  async getById(): Promise<void> {
    const livros = await this.service.list()
    const livro = await selectFromList(livros, (l) => l.getTitulo())
    if (!livro) {
      return
    }
    this.print(livro)
  }

  async update(): Promise<void> {
    const livros = await this.service.list()
    const selecionado = await selectFromList(livros, (l) => l.getTitulo())
    if (!selecionado) {
      return
    }

    const titulo = await ReadlineUtil.ask('Novo título (ENTER para manter o atual): ')
    const genero = await ReadlineUtil.ask('Novo gênero (ENTER para manter o atual): ')
    const isbn = await ReadlineUtil.ask('Novo ISBN (ENTER para manter o atual): ')
    const anoTexto = await ReadlineUtil.ask('Novo ano de publicação (ENTER para manter o atual): ')
    const quantidadeTexto = await ReadlineUtil.ask('Nova quantidade total (ENTER para manter o atual): ')
    const trocarAutor = await ReadlineUtil.ask('Trocar o autor deste livro? (s/N): ')

    let autorId: number | undefined
    if (trocarAutor.trim().toLowerCase() === 's') {
      const autor = await this.pickAutor()
      if (!autor) {
        return
      }
      autorId = autor.id
    }

    const livro = await this.service.update(selecionado.id, {
      autorId,
      titulo: titulo || undefined,
      genero: genero || undefined,
      isbn: isbn || undefined,
      anoPublicacao: anoTexto ? Number(anoTexto) : undefined,
      quantidadeTotal: quantidadeTexto ? Number(quantidadeTexto) : undefined
    })

    console.log('Livro atualizado com sucesso:')
    this.print(livro)
  }

  async remove(): Promise<void> {
    const livros = await this.service.list()
    const livro = await selectFromList(livros, (l) => l.getTitulo())
    if (!livro) {
      return
    }
    await this.service.remove(livro.id)
    console.log('Livro removido com sucesso.')
  }

  private async pickAutor(): Promise<Autor | null> {
    const autores = await this.autorService.list()

    if (autores.length === 0) {
      console.log('Nenhum autor cadastrado ainda.')
      return this.createAutorInline()
    }

    console.log('Lista dos Autores já cadastrados:')
    autores.forEach((autor, index) => {
      console.log(`${index + 1}. ${autor.nomeCompleto}`)
    })

    const escolha = await ReadlineUtil.ask('Digite S para selecionar um autor da lista ou N para cadastrar um novo: ')

    if (escolha.trim().toLowerCase() === 'n') {
      return this.createAutorInline()
    }

    const numero = await ReadlineUtil.askNumber('Escolha o autor: ')
    const index = numero - 1
    if (index < 0 || index >= autores.length) {
      console.log('Opção inválida.')
      return null
    }
    return autores[index]
  }

  private async createAutorInline(): Promise<Autor> {
    console.log('Cadastro de novo autor:')
    const nome = await ReadlineUtil.ask('Nome: ')
    const sobrenome = await ReadlineUtil.ask('Sobrenome (opcional): ')
    const nacionalidade = await ReadlineUtil.ask('Nacionalidade (opcional): ')

    const autor = await this.autorService.create({
      nome,
      sobrenome: sobrenome || undefined,
      nacionalidade: nacionalidade || undefined
    })

    console.log(`Autor cadastrado: #${autor.id} - ${autor.nomeCompleto}`)
    return autor
  }

  private print(livro: Livro): void {
    const genero = livro.getGenero()
    const ano = livro.getAnoPublicacao()
    const isbn = livro.getIsbn()
    console.log(
      `#${livro.id} - ${livro.getTitulo()}` +
      `${genero ? ` | ${genero}` : ''}` +
      `${ano ? ` (${ano})` : ''}` +
      `${isbn ? ` | ISBN: ${isbn}` : ''}` +
      ` | Disponível: ${livro.getQuantidadeDisponivel()}/${livro.getQuantidadeTotal()}`
    )
  }
}
