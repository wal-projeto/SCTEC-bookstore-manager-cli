export function isForeignKeyViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: unknown }).code === '23503'
  )
}

export function isUniqueViolation(error: unknown, constraint?: string): boolean {
  if (
    typeof error !== 'object' ||
    error === null ||
    !('code' in error) ||
    (error as { code: unknown }).code !== '23505'
  ) {
    return false
  }
  if (!constraint) {
    return true
  }
  return 'constraint' in error && (error as { constraint: unknown }).constraint === constraint
}
