-- ============================================================
--  BookStore Manager CLI - Schema PostgreSQL
--  Entidades: autor, livro, cliente, emprestimo
-- ============================================================

CREATE TYPE status_emprestimo AS ENUM ('ativo', 'devolvido');

-- ------------------------------------------------------------
-- autor
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS autor (
    id              INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome            VARCHAR      NOT NULL,
    sobrenome       VARCHAR,
    cpf             CHAR(11)     UNIQUE,
    data_nascimento DATE
);

-- ------------------------------------------------------------
-- cliente
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cliente (
    id        INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome      VARCHAR      NOT NULL,
    sobrenome VARCHAR,
    cpf       CHAR(11)     NOT NULL UNIQUE,
    email     VARCHAR      UNIQUE,
    telefone  VARCHAR
);

-- ------------------------------------------------------------
-- livro
-- quantidade_disponivel é mantida junto com quantidade_total para
-- refletir empréstimos ativos sem precisar recontar a cada consulta.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS livro (
    id                     INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    autor_id               INTEGER      NOT NULL REFERENCES autor(id),
    titulo                 VARCHAR      NOT NULL,
    genero                 VARCHAR,
    ano_publicacao         INTEGER,
    isbn                   VARCHAR      UNIQUE,
    quantidade_total       INTEGER      NOT NULL DEFAULT 1 CHECK (quantidade_total >= 0),
    quantidade_disponivel  INTEGER      NOT NULL DEFAULT 1 CHECK (quantidade_disponivel >= 0),
    CHECK (quantidade_disponivel <= quantidade_total)
);

-- ------------------------------------------------------------
-- emprestimo
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS emprestimo (
    id              INTEGER              GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    livro_id        INTEGER              NOT NULL REFERENCES livro(id),
    cliente_id      INTEGER              NOT NULL REFERENCES cliente(id),
    data_emprestimo TIMESTAMP            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_devolucao  TIMESTAMP,
    status          status_emprestimo    NOT NULL DEFAULT 'ativo'
);
