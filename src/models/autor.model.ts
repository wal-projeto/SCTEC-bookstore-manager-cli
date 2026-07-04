export interface AutorProps {
  id: number
  nome: string
  sobrenome?: string | null
  cpf?: string | null
  dataNascimento?: Date | null
}

export class Autor {
  readonly id: number

  private nome: string
  private sobrenome: string | null
  private cpf: string | null
  private dataNascimento: Date | null

  constructor(props: AutorProps) {
    this.id = props.id
    this.nome = props.nome
    this.sobrenome = props.sobrenome ?? null
    this.cpf = props.cpf ?? null
    this.dataNascimento = props.dataNascimento ?? null
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

  getCpf(): string | null {
    return this.cpf
  }

  getDataNascimento(): Date | null {
    return this.dataNascimento
  }

  get nomeCompleto(): string {
    return this.sobrenome ? `${this.nome} ${this.sobrenome}` : this.nome
  }
}
