// FUNÇÕES para checar campos obrigatórios, sem reescrever essa lógica

export function isValidCpf(cpf: string): boolean {
  return /^\d{11}$/.test(cpf)
} // REGEX: só checa se são 11 digitos numéricos, só o formato - não checa o digito verificador real do CPF.


export function isBlank(value: string | undefined | null): boolean {
  return !value || value.trim().length === 0
} // Recebe um texto, ou undefined ou null (caso nao tenha digitado nada) e diz que está vazio(nao veio nada ou so espaco em branco) .trim remove espacos antes de checar o tamanho
// Conexão com o ENUM do SQL: são duas camadas de defesa diferentes, na ordem que os dados percorrem:
// Terminal → Controller → Service (valida AQUI, em TypeScript) → Repository → Banco (valida de novo, com ENUM/CHECK)

export function isValidNome(nome: string): boolean {
  return /^(?=.*\p{L})[\p{L}\s'-]+$/u.test(nome.trim())
}
// Regex permite: letras(com acento) + espaço; letras + apóstrofo ; letras + hífen; ç pe uma letra Unicode;
// (?=.*\p{L}) exige pelo menos uma letra em algum lugar - sem isso, "---" ou "''" passariam
// não permite nome com número ou símbolo fora de espaço/apóstrofo/hífen
