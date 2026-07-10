// npx prettier --write src ( .PRETTIERRC REFORMATA TODOS OS ARQUIVOS DO src)

import 'dotenv/config'

import { AutorController } from './controllers/autor.controller'
import { closeDatabase, initDatabase, pool } from './database/connection'
import { MainMenu } from './menus/main.menu'
import { AutorMenu } from './menus/autor.menu'
import { AutorRepository } from './repositories/autor.repository'
import { AutorService } from './services/autor.service'
import { ReadlineUtil } from './utils/readline.util'

async function bootstrap(): Promise<void> {
  console.log('Conectando ao banco de dados...')
  await initDatabase()
  console.log('Conexão estabelecida com sucesso.')

  const autorRepository = new AutorRepository(pool)
  const autorService = new AutorService(autorRepository)
  const autorController = new AutorController(autorService)
  const autorMenu = new AutorMenu(autorController)
  const mainMenu = new MainMenu(autorMenu)
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
