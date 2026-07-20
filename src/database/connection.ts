import { Pool } from 'pg'

const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined

export const pool = new Pool({
  host: process.env.DB_HOST,
  port,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 10,
  min: 2
})

pool.on('error', (err) => {
  console.error('Erro inesperado no pool de conexões:', err)
  process.exit(1)
})

export async function initDatabase(): Promise<void> {
  await pool.query('SELECT 1')
}

export async function closeDatabase(): Promise<void> {
  await pool.end()
}
