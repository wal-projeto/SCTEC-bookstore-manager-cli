import 'dotenv/config'

import { AutorController } from './controllers/autor.controller'
import { LivroController } from './controllers/livro.controller'
import { ClienteController } from './controllers/cliente.controller'
import { EmprestimoController } from './controllers/emprestimo.controller'
import { RelatorioController } from './controllers/relatorio.controller'
import { closeDatabase, initDatabase, pool } from './database/connection'
import { MainMenu } from './menus/main.menu'
import { AutorMenu } from './menus/autor.menu'
import { LivroMenu } from './menus/livro.menu'
import { ClienteMenu } from './menus/cliente.menu'
import { EmprestimoMenu } from './menus/emprestimo.menu'
import { RelatorioMenu } from './menus/relatorio.menu'
import { AutorRepository } from './repositories/autor.repository'
import { LivroRepository } from './repositories/livro.repository'
import { ClienteRepository } from './repositories/cliente.repository'
import { EmprestimoRepository } from './repositories/emprestimo.repository'
import { RelatorioRepository } from './repositories/relatorio.repository'
import { AutorService } from './services/autor.service'
import { LivroService } from './services/livro.service'
import { ClienteService } from './services/cliente.service'
import { EmprestimoService } from './services/emprestimo.service'
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

  const clienteRepository = new ClienteRepository(pool)
  const clienteService = new ClienteService(clienteRepository)
  const clienteController = new ClienteController(clienteService)
  const clienteMenu = new ClienteMenu(clienteController)

  const emprestimoRepository = new EmprestimoRepository(pool)
  const emprestimoService = new EmprestimoService(emprestimoRepository, livroRepository, clienteRepository)
  const emprestimoController = new EmprestimoController(emprestimoService, livroService, clienteService)
  const emprestimoMenu = new EmprestimoMenu(emprestimoController)

  const relatorioRepository = new RelatorioRepository(pool)
  const relatorioController = new RelatorioController(relatorioRepository)
  const relatorioMenu = new RelatorioMenu(relatorioController)

  const mainMenu = new MainMenu(autorMenu, livroMenu, clienteMenu, emprestimoMenu, relatorioMenu)
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
