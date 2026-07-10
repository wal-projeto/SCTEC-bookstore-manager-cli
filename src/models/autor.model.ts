/** Apricando os recursos de TypeScript:
 * RF19: interfaces, classes, modificadores de acesso,
 * readonly, getters/setters, construtores e métodos
 */

// contrato de formato: nenhum comportamento. Para criar um Autor, devo dar um objeto com esse formato
export interface AutorProps {
  id: number
  nome: string
  sobrenome?: string | null
  nacionalidade?: string | null
}

// molde real do objeto que a app utilizará
export class Autor {
  readonly id: number // id publico: o controller precisa mostrar ID, só nao pode ser reescrito depois de criado
  private nome: string
  private sobrenome: string | null
  private nacionalidade: string | null

  // o contructor recebe um objeto AutorPops já documentado
  constructor(props: AutorProps) {
    this.id = props.id
    this.nome = props.nome
    this.sobrenome = props.sobrenome ?? null
    this.nacionalidade = props.nacionalidade ?? null
  }

  // métodos como portas controladas para as private: get(leitura) e set(escrita)
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
/**getNome() é um método normal — você chama com parênteses: autor.getNome(). Já get nomeCompleto() usa a palavra-chave get na declaração,
 * e você usa sem parênteses: autor.nomeCompleto, como se fosse um campo comum, invocando esse get.
 * Isso se chama propriedade computada (accessor). A diferença de fundo: nomeCompleto
 * não é um dado guardado — ele é calculado na hora, juntando nome + sobrenome (só gruda o sobrenome se ele existir):
 * return this.sobrenome ? `${this.nome} ${this.sobrenome}` : this.nome
 */
