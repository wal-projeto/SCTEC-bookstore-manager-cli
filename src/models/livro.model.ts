export interface LivroProps {
  id: number
  autorId: number
  titulo: string
  genero?: string | null
  anoPublicacao?: number | null
  isbn?: string | null
  quantidadeTotal: number
  quantidadeDisponivel: number
}

export class Livro {
  readonly id: number
  private autorId: number
  private titulo: string
  private genero: string | null
  private anoPublicacao: number | null
  private isbn: string | null
  private quantidadeTotal: number
  private quantidadeDisponivel: number

  constructor(props: LivroProps) {
    this.id = props.id
    this.autorId = props.autorId
    this.titulo = props.titulo
    this.genero = props.genero ?? null
    this.anoPublicacao = props.anoPublicacao ?? null
    this.isbn = props.isbn ?? null
    this.quantidadeTotal = props.quantidadeTotal
    this.quantidadeDisponivel = props.quantidadeDisponivel
  }

  getAutorId(): number {
    return this.autorId
  }

  setAutorId(autorId: number): void {
    this.autorId = autorId
  }

  getTitulo(): string {
    return this.titulo
  }

  setTitulo(titulo: string): void {
    this.titulo = titulo
  }

  getGenero(): string | null {
    return this.genero
  }

  setGenero(genero: string | null): void {
    this.genero = genero
  }

  getAnoPublicacao(): number | null {
    return this.anoPublicacao
  }

  setAnoPublicacao(anoPublicacao: number | null): void {
    this.anoPublicacao = anoPublicacao
  }

  getIsbn(): string | null {
    return this.isbn
  }

  setIsbn(isbn: string | null): void {
    this.isbn = isbn
  }

  getQuantidadeTotal(): number {
    return this.quantidadeTotal
  }

  setQuantidadeTotal(quantidadeTotal: number): void {
    this.quantidadeTotal = quantidadeTotal
  }

  getQuantidadeDisponivel(): number {
    return this.quantidadeDisponivel
  }

  setQuantidadeDisponivel(quantidadeDisponivel: number): void {
    this.quantidadeDisponivel = quantidadeDisponivel
  }

  get estaDisponivel(): boolean {
    return this.quantidadeDisponivel > 0
  }
}
