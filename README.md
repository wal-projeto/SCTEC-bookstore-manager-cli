# BookStore Manager CLI

Projeto Final Avaliativo - Módulo 01 - Semana 13 - SCTEC Back End Node T1/T2.

Aplicação CLI para gerenciamento de uma livraria (autores, livros, clientes e empréstimos), utilizando Node.js, TypeScript e PostgreSQL.

> Em desenvolvimento.

## ObjetivosMarkdown Preview Mermaid Support

- Gerenciar autores, livros, clientes e empréstimos via terminal.
- Persistir os dados em um banco PostgreSQL, com regras de negócio aplicadas antes de qualquer escrita (ex.: livro precisa de autor cadastrado, empréstimo exige disponibilidade).
- Disponibilizar relatórios estratégicos a partir de consultas relacionais (JOIN, GROUP BY, agregações).

## Tecnologias

- Node.js + TypeScript (modo `strict`)
- [`pg`](https://node-postgres.com/) para acesso ao PostgreSQL (queries parametrizadas, sem ORM)
- `dotenv` para configuração de ambiente
- ESLint + Prettier

## Arquitetura

```
src/
├── main.ts            # Ponto de entrada: conecta ao banco e inicia o menu principal
├── menus/              # Navegação entre telas/opções do CLI
├── controllers/        # Interação com o terminal (leitura de input, exibição de saída)
├── services/            # Regras de negócio e validações
├── repositories/        # Acesso a dados via `pg` (queries parametrizadas)
├── models/              # Classes e interfaces das entidades
├── database/            # Conexão (pool) e schema.sql
├── utils/                # Funções auxiliares (readline, validadores)
└── errors/               # Classes de erro customizadas (ValidationError, NotFoundError)
```

Fluxo de dependências: `main.ts` → `menus` → `controllers` → `services` → `repositories` → banco de dados.

## Modelagem do banco de dados

Entidades: `autor`, `livro`, `cliente`, `emprestimo`.

- Um livro pertence a um autor (`livro.autor_id` → `autor.id`).
- Um empréstimo relaciona um livro e um cliente (`emprestimo.livro_id`, `emprestimo.cliente_id`), com `status` (`ativo` | `devolvido`).
- `livro.quantidade_disponivel` é decrementada a cada empréstimo ativo e incrementada na devolução.

Script completo em [`src/database/schema.sql`](src/database/schema.sql).

## Instalação e execução

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+ em execução

### Passo a passo

1. Instale as dependências:

   ```bash
   npm install
   ```
2. Copie o arquivo de variáveis de ambiente e ajuste com as credenciais do seu PostgreSQL:

   ```bash
   cp .env.example .env
   ```
3. Crie o banco de dados e aplique o schema:

   ```bash
   createdb bookstore_manager
   psql -d bookstore_manager -f src/database/schema.sql
   ```
4. Execute a aplicação em modo desenvolvimento:

   ```bash
   npm run dev
   ```

   Ou compile e execute a versão de produção:

   ```bash
   npm run build
   npm start
   ```

## Funcionalidades implementadas

- [X] Cadastro, listagem, consulta, atualização e remoção de autores
- [ ] Gerenciamento de livros
- [ ] Gerenciamento de clientes
- [ ] Empréstimos e devoluções
- [ ] Relatórios

## Exemplo de uso

```MySQL
=== BookStore Manager CLI ===
1. Autores
2. Livros (em breve)
3. Clientes (em breve)
4. Empréstimos (em breve)
5. Relatórios (em breve)
0. Encerrar aplicação
Escolha uma opção: 1

--- Menu Autores ---
1. Cadastrar autor
2. Listar autores
3. Consultar autor por ID
4. Atualizar autor
5. Remover autor
0. Voltar
Escolha uma opção: 1
Nome: João
Sobrenome (opcional): Silva
CPF - 11 dígitos (opcional): 12345678901
Data de nascimento AAAA-MM-DD (opcional): 1980-05-20
Autor cadastrado com sucesso:
#1 - João Silva | CPF: 12345678901
```

## Integrantes

- (preencher)
