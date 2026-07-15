// npx prettier --write src ( .PRETTIERRC REFORMATA TODOS OS ARQUIVOS DO src)

import 'dotenv/config'

import { AutorController } from './controllers/autor.controller'
import { LivroController } from './controllers/livro.controller'
import { closeDatabase, initDatabase, pool } from './database/connection'
import { MainMenu } from './menus/main.menu'
import { AutorMenu } from './menus/autor.menu'
import { LivroMenu } from './menus/livro.menu'
import { AutorRepository } from './repositories/autor.repository'
import { LivroRepository } from './repositories/livro.repository'
import { AutorService } from './services/autor.service'
import { LivroService } from './services/livro.service'
import { ReadlineUtil } from './utils/readline.util'

async function bootstrap(): Promise<void> {
  console.log('Conectando ao banco de dados...')
  await initDatabase()
  console.log('Conexão estabelecida com sucesso.')

  const autorRepository = new AutorRepository(pool)
  const autorService = new AutorService(autorRepository)
  const autorController = new AutorController(autorService)
  const autorMenu = new AutorMenu(autorController)

  const livroRepository = new LivroRepository(pool)
  const livroService = new LivroService(livroRepository, autorRepository)
  const livroController = new LivroController(livroService, autorService)
  const livroMenu = new LivroMenu(livroController)

  const mainMenu = new MainMenu(autorMenu, livroMenu)
  await mainMenu.start()
}

bootstrap()
  .catch((error: unknown) => {
    console.error('Erro fatal ao iniciar a aplicação:', error)
  })
  .finally(() => {
    ReadlineUtil.close()
    void closeDatabase()
  })
