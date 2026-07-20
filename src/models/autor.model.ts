export interface AutorProps {
  id: number
  nome: string
  sobrenome?: string | null
  nacionalidade?: string | null
}

export class Autor {
  readonly id: number
  private nome: string
  private sobrenome: string | null
  private nacionalidade: string | null

  constructor(props: AutorProps) {
    this.id = props.id
    this.nome = props.nome
    this.sobrenome = props.sobrenome ?? null
    this.nacionalidade = props.nacionalidade ?? null
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

  getNacionalidade(): string | null {
    return this.nacionalidade
  }

  setNacionalidade(nacionalidade: string | null) {
    this.nacionalidade = nacionalidade
  }

  get nomeCompleto(): string {
    return this.sobrenome ? `${this.nome} ${this.sobrenome}` : this.nome
  }
}
