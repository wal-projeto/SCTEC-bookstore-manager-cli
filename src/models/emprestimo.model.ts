export type StatusEmprestimo = 'ativo' | 'devolvido'

export interface EmprestimoProps {
  id: number
  livroId: number
  clienteId: number
  dataEmprestimo: Date
  dataPrevistaDevolucao: Date
  dataDevolucaoReal?: Date | null
  status: StatusEmprestimo
}

export class Emprestimo {
  readonly id: number
  readonly livroId: number
  readonly clienteId: number
  readonly dataEmprestimo: Date
  readonly dataPrevistaDevolucao: Date
  private dataDevolucaoReal: Date | null
  private status: StatusEmprestimo

  constructor(props: EmprestimoProps) {
    this.id = props.id
    this.livroId = props.livroId
    this.clienteId = props.clienteId
    this.dataEmprestimo = props.dataEmprestimo
    this.dataPrevistaDevolucao = props.dataPrevistaDevolucao
    this.dataDevolucaoReal = props.dataDevolucaoReal ?? null
    this.status = props.status
  }

  getDataDevolucaoReal(): Date | null {
    return this.dataDevolucaoReal
  }

  getStatus(): StatusEmprestimo {
    return this.status
  }

  marcarComoDevolvido(dataDevolucaoReal: Date): void {
    this.status = 'devolvido'
    this.dataDevolucaoReal = dataDevolucaoReal
  }

  get estaAtivo(): boolean {
    return this.status === 'ativo'
  }
}
