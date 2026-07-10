// LÓGICA DE CONECÇÃO, NÃO UMA CONEXÃO DE FATO

import { Pool } from 'pg'


/**
 * operador ternário: condição ? valorSeVerdadeiro : valorSeFalso. 
 * Se DB_PORT existir (qualquer texto não-vazio é "verdadeiro" em JS), 
 * converte pra número. Se não existir (undefined), o resultado é undefined 
 * também — sem tentar converter nada.
 */
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
