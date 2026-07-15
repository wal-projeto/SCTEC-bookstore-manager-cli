import { EmprestimoDetalhado } from '../repositories/emprestimo.repository'
import { EmprestimoService } from '../services/emprestimo.service'
import { LivroService } from '../services/livro.service'
import { ClienteService } from '../services/cliente.service'
import { selectFromList } from '../utils/select-from-list.util'

export class EmprestimoController {
  constructor(
    private readonly service: EmprestimoService,
    private readonly livroService: LivroService,
    private readonly clienteService: ClienteService
  ) {}

  async create(): Promise<void> {
    const livros = await this.livroService.list()
    const livro = await selectFromList(
      livros,
      (l) => `${l.getTitulo()} (Disponível: ${l.getQuantidadeDisponivel()}/${l.getQuantidadeTotal()})`
    )
    if (!livro) {
      return
    }
    if (!livro.estaDisponivel) {
      console.log('Este livro não está disponível para empréstimo no momento.')
      return
    }

    const clientes = await this.clienteService.list()
    const cliente = await selectFromList(clientes, (c) => c.nomeCompleto)
    if (!cliente) {
      return
    }

    const emprestimo = await this.service.create({ livroId: livro.id, clienteId: cliente.id })

    console.log('Empréstimo registrado com sucesso:')
    console.log(
      `#${emprestimo.id} - "${livro.getTitulo()}" para ${cliente.nomeCompleto}` +
      ` | Prazo: ${this.formatDate(emprestimo.dataPrevistaDevolucao)}`
    )
  }

  async list(): Promise<void> {
    const emprestimos = await this.service.list()
    if (emprestimos.length === 0) {
      console.log('Nenhum empréstimo registrado.')
      return
    }
    emprestimos.forEach((emprestimo) => this.print(emprestimo))
  }

  async devolver(): Promise<void> {
    const emprestimos = await this.service.list()
    const ativos = emprestimos.filter((emprestimo) => emprestimo.status === 'ativo')
    const selecionado = await selectFromList(ativos, (e) => `${e.livroTitulo} — ${e.clienteNome}`)
    if (!selecionado) {
      return
    }

    await this.service.registrarDevolucao(selecionado.id)
    console.log('Devolução registrada com sucesso.')
  }

  private print(emprestimo: EmprestimoDetalhado): void {
    const statusLabel = emprestimo.status === 'ativo' ? 'Ativo' : 'Devolvido'
    const devolucao = emprestimo.dataDevolucaoReal
      ? ` | Devolvido em: ${this.formatDate(emprestimo.dataDevolucaoReal)}`
      : ''
    console.log(
      `#${emprestimo.id} - "${emprestimo.livroTitulo}" | Cliente: ${emprestimo.clienteNome}` +
      ` | Emprestado em: ${this.formatDate(emprestimo.dataEmprestimo)}` +
      ` | Prazo: ${this.formatDate(emprestimo.dataPrevistaDevolucao)}` +
      ` | Status: ${statusLabel}${devolucao}`
    )
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR')
  }
}
