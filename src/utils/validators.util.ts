export function isValidCpf(cpf: string): boolean {
  return /^\d{11}$/.test(cpf)
}

export function isBlank(value: string | undefined | null): boolean {
  return !value || value.trim().length === 0
}

export function isValidNome(nome: string): boolean {
  return /^(?=.*\p{L})[\p{L}\s'-]+$/u.test(nome.trim())
}

export function isValidIsbn(isbn: string): boolean {
  const semSeparadores = isbn.replace(/[-\s]/g, '').toUpperCase()
  return /^\d{9}[\dX]$/.test(semSeparadores) || /^\d{13}$/.test(semSeparadores)
}

export function isValidAno(ano: number): boolean {
  return Number.isInteger(ano) && ano >= 1000 && ano <= new Date().getFullYear()
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}
