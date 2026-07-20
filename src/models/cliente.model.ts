export interface ClienteProps {
  id: number
  nome: string
  sobrenome?: string | null
  cpf: string
  email?: string | null
  telefone?: string | null
}

export class Cliente {
  readonly id: number
  readonly cpf: string
  private nome: string
  private sobrenome: string | null
  private email: string | null
  private telefone: string | null

  constructor(props: ClienteProps) {
    this.id = props.id
    this.cpf = props.cpf
    this.nome = props.nome
    this.sobrenome = props.sobrenome ?? null
    this.email = props.email ?? null
    this.telefone = props.telefone ?? null
  }

  getNome(): string {
    return this.nome
  }

  setNome(nome: string): void {
    this.nome = nome
  }

  getSobrenome(): string | null {
    return this.sobrenome
  }

  setSobrenome(sobrenome: string | null): void {
    this.sobrenome = sobrenome
  }

  getEmail(): string | null {
    return this.email
  }

  setEmail(email: string | null): void {
    this.email = email
  }

  getTelefone(): string | null {
    return this.telefone
  }

  setTelefone(telefone: string | null): void {
    this.telefone = telefone
  }

  get nomeCompleto(): string {
    return this.sobrenome ? `${this.nome} ${this.sobrenome}` : this.nome
  }
}
