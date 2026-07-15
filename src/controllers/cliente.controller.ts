import { Cliente } from '../models/cliente.model'
import { ClienteService } from '../services/cliente.service'
import { ReadlineUtil } from '../utils/readline.util'
import { selectFromList } from '../utils/select-from-list.util'

export class ClienteController {
  constructor(private readonly service: ClienteService) {}

  async create(): Promise<void> {
    const nome = await ReadlineUtil.ask('Nome: ')
    const sobrenome = await ReadlineUtil.ask('Sobrenome (opcional): ')
    const cpf = await ReadlineUtil.ask('CPF (11 dígitos): ')
    const email = await ReadlineUtil.ask('Email (opcional): ')
    const telefone = await ReadlineUtil.ask('Telefone (opcional): ')

    const cliente = await this.service.create({
      nome,
      sobrenome: sobrenome || undefined,
      cpf,
      email: email || undefined,
      telefone: telefone || undefined
    })

    console.log('Cliente cadastrado com sucesso:')
    this.print(cliente)
  }

  async list(): Promise<void> {
    const clientes = await this.service.list()
    if (clientes.length === 0) {
      console.log('Nenhum cliente cadastrado.')
      return
    }
    clientes.forEach((cliente) => this.print(cliente))
  }

  async getById(): Promise<void> {
    const clientes = await this.service.list()
    const cliente = await selectFromList(clientes, (c) => c.nomeCompleto)
    if (!cliente) {
      return
    }
    this.print(cliente)
  }

  async update(): Promise<void> {
    const clientes = await this.service.list()
    const selecionado = await selectFromList(clientes, (c) => c.nomeCompleto)
    if (!selecionado) {
      return
    }

    const nome = await ReadlineUtil.ask('Novo nome (ENTER para manter o atual): ')
    const sobrenome = await ReadlineUtil.ask('Novo sobrenome (ENTER para manter o atual): ')
    const email = await ReadlineUtil.ask('Novo email (ENTER para manter o atual): ')
    const telefone = await ReadlineUtil.ask('Novo telefone (ENTER para manter o atual): ')

    const cliente = await this.service.update(selecionado.id, {
      nome: nome || undefined,
      sobrenome: sobrenome || undefined,
      email: email || undefined,
      telefone: telefone || undefined
    })

    console.log('Cliente atualizado com sucesso:')
    this.print(cliente)
  }

  async remove(): Promise<void> {
    const clientes = await this.service.list()
    const cliente = await selectFromList(clientes, (c) => c.nomeCompleto)
    if (!cliente) {
      return
    }
    await this.service.remove(cliente.id)
    console.log('Cliente removido com sucesso.')
  }

  private print(cliente: Cliente): void {
    const email = cliente.getEmail()
    const telefone = cliente.getTelefone()
    console.log(
      `#${cliente.id} - ${cliente.nomeCompleto} | CPF: ${cliente.cpf}` +
      `${email ? ` | Email: ${email}` : ''}` +
      `${telefone ? ` | Telefone: ${telefone}` : ''}`
    )
  }
}
