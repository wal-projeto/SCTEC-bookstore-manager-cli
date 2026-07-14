-- ============================================================
--  BookStore Manager CLI - Seed (carga inicial de dados)
--  Rode depois do schema.sql:
--    psql -d bookstore_manager -f src/database/schema.sql
--    psql -d bookstore_manager -f src/database/seed.sql
--
--  Idempotente (usa NOT EXISTS / ON CONFLICT em todas as tabelas,
--  rodar de novo não duplica nada). O emprestimo usa datas relativas
--  (CURRENT_TIMESTAMP - INTERVAL) só pra sempre parecer "recente".
-- ============================================================

-- ------------------------------------------------------------
-- autor (5 registros)
-- ------------------------------------------------------------
INSERT INTO autor (nome, sobrenome, nacionalidade)
SELECT 'Machado', 'de Assis', 'Brasileira'
WHERE NOT EXISTS (SELECT 1 FROM autor WHERE nome = 'Machado' AND sobrenome = 'de Assis');

INSERT INTO autor (nome, sobrenome, nacionalidade)
SELECT 'Clarice', 'Lispector', 'Brasileira'
WHERE NOT EXISTS (SELECT 1 FROM autor WHERE nome = 'Clarice' AND sobrenome = 'Lispector');

INSERT INTO autor (nome, sobrenome, nacionalidade)
SELECT 'Jorge', 'Amado', 'Brasileira'
WHERE NOT EXISTS (SELECT 1 FROM autor WHERE nome = 'Jorge' AND sobrenome = 'Amado');

INSERT INTO autor (nome, sobrenome, nacionalidade)
SELECT 'J.K.', 'Rowling', 'Britânica'
WHERE NOT EXISTS (SELECT 1 FROM autor WHERE nome = 'J.K.' AND sobrenome = 'Rowling');

INSERT INTO autor (nome, sobrenome, nacionalidade)
SELECT 'Gabriel', 'García Márquez', 'Colombiana'
WHERE NOT EXISTS (SELECT 1 FROM autor WHERE nome = 'Gabriel' AND sobrenome = 'García Márquez');

-- ------------------------------------------------------------
-- cliente (5 registros)
-- ------------------------------------------------------------
INSERT INTO cliente (nome, sobrenome, cpf, email, telefone) VALUES
    ('Ana', 'Souza', '11122233344', 'ana.souza@email.com', '(11) 91234-5678'),
    ('Bruno', 'Lima', '22233344455', 'bruno.lima@email.com', '(21) 92345-6789'),
    ('Carla', 'Ferreira', '33344455566', 'carla.ferreira@email.com', '(31) 93456-7890'),
    ('Diego', 'Santos', '44455566677', 'diego.santos@email.com', '(41) 94567-8901'),
    ('Elisa', 'Ramos', '55566677788', 'elisa.ramos@email.com', '(51) 95678-9012')
ON CONFLICT (cpf) DO NOTHING;

-- ------------------------------------------------------------
-- livro (10 registros) - autor_id resolvido por nome/sobrenome
-- ------------------------------------------------------------
INSERT INTO livro (autor_id, titulo, genero, ano_publicacao, isbn, quantidade_total, quantidade_disponivel)
SELECT id, 'Dom Casmurro', 'Romance', 1899, '9788535910672', 3, 3
FROM autor WHERE nome = 'Machado' AND sobrenome = 'de Assis'
ON CONFLICT (isbn) DO NOTHING;

INSERT INTO livro (autor_id, titulo, genero, ano_publicacao, isbn, quantidade_total, quantidade_disponivel)
SELECT id, 'Memórias Póstumas de Brás Cubas', 'Romance', 1881, '9788525406958', 2, 2
FROM autor WHERE nome = 'Machado' AND sobrenome = 'de Assis'
ON CONFLICT (isbn) DO NOTHING;

INSERT INTO livro (autor_id, titulo, genero, ano_publicacao, isbn, quantidade_total, quantidade_disponivel)
SELECT id, 'A Hora da Estrela', 'Romance', 1977, '9788532507860', 2, 1
FROM autor WHERE nome = 'Clarice' AND sobrenome = 'Lispector'
ON CONFLICT (isbn) DO NOTHING;

INSERT INTO livro (autor_id, titulo, genero, ano_publicacao, isbn, quantidade_total, quantidade_disponivel)
SELECT id, 'Laços de Família', 'Contos', 1960, '9788532530394', 2, 2
FROM autor WHERE nome = 'Clarice' AND sobrenome = 'Lispector'
ON CONFLICT (isbn) DO NOTHING;

INSERT INTO livro (autor_id, titulo, genero, ano_publicacao, isbn, quantidade_total, quantidade_disponivel)
SELECT id, 'Gabriela, Cravo e Canela', 'Romance', 1958, '9788535912324', 3, 2
FROM autor WHERE nome = 'Jorge' AND sobrenome = 'Amado'
ON CONFLICT (isbn) DO NOTHING;

INSERT INTO livro (autor_id, titulo, genero, ano_publicacao, isbn, quantidade_total, quantidade_disponivel)
SELECT id, 'Capitães da Areia', 'Romance', 1937, '9788535914762', 2, 2
FROM autor WHERE nome = 'Jorge' AND sobrenome = 'Amado'
ON CONFLICT (isbn) DO NOTHING;

INSERT INTO livro (autor_id, titulo, genero, ano_publicacao, isbn, quantidade_total, quantidade_disponivel)
SELECT id, 'Harry Potter e a Pedra Filosofal', 'Fantasia', 1997, '9788532511010', 4, 4
FROM autor WHERE nome = 'J.K.' AND sobrenome = 'Rowling'
ON CONFLICT (isbn) DO NOTHING;

INSERT INTO livro (autor_id, titulo, genero, ano_publicacao, isbn, quantidade_total, quantidade_disponivel)
SELECT id, 'Harry Potter e a Câmara Secreta', 'Fantasia', 1998, '9788532511027', 3, 3
FROM autor WHERE nome = 'J.K.' AND sobrenome = 'Rowling'
ON CONFLICT (isbn) DO NOTHING;

INSERT INTO livro (autor_id, titulo, genero, ano_publicacao, isbn, quantidade_total, quantidade_disponivel)
SELECT id, 'Cem Anos de Solidão', 'Realismo Mágico', 1967, '9788501063279', 2, 1
FROM autor WHERE nome = 'Gabriel' AND sobrenome = 'García Márquez'
ON CONFLICT (isbn) DO NOTHING;

INSERT INTO livro (autor_id, titulo, genero, ano_publicacao, isbn, quantidade_total, quantidade_disponivel)
SELECT id, 'O Amor nos Tempos do Cólera', 'Romance', 1985, '9788501063286', 2, 2
FROM autor WHERE nome = 'Gabriel' AND sobrenome = 'García Márquez'
ON CONFLICT (isbn) DO NOTHING;

-- ------------------------------------------------------------
-- emprestimo (5 registros) - livro/cliente resolvidos por isbn/cpf
-- 3 ativos (um deles já atrasado) + 2 já devolvidos
-- idempotente via NOT EXISTS por (livro_id, cliente_id): não existe
-- chave natural única de verdade pra um empréstimo, mas como o seed
-- só cria 1 empréstimo por par livro/cliente, isso basta pra não duplicar.
-- ------------------------------------------------------------

-- ativo: A Hora da Estrela / Ana Souza
INSERT INTO emprestimo (livro_id, cliente_id, data_emprestimo, data_prevista_devolucao, data_devolucao_real, status)
SELECT l.id, c.id, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '9 days', NULL, 'ativo'
FROM livro l, cliente c
WHERE l.isbn = '9788532507860' AND c.cpf = '11122233344'
AND NOT EXISTS (SELECT 1 FROM emprestimo e WHERE e.livro_id = l.id AND e.cliente_id = c.id);

-- ativo: Gabriela, Cravo e Canela / Bruno Lima
INSERT INTO emprestimo (livro_id, cliente_id, data_emprestimo, data_prevista_devolucao, data_devolucao_real, status)
SELECT l.id, c.id, CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP + INTERVAL '11 days', NULL, 'ativo'
FROM livro l, cliente c
WHERE l.isbn = '9788535912324' AND c.cpf = '22233344455'
AND NOT EXISTS (SELECT 1 FROM emprestimo e WHERE e.livro_id = l.id AND e.cliente_id = c.id);

-- ativo e ATRASADO: Cem Anos de Solidão / Carla Ferreira (prazo venceu há 6 dias)
INSERT INTO emprestimo (livro_id, cliente_id, data_emprestimo, data_prevista_devolucao, data_devolucao_real, status)
SELECT l.id, c.id, CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '6 days', NULL, 'ativo'
FROM livro l, cliente c
WHERE l.isbn = '9788501063279' AND c.cpf = '33344455566'
AND NOT EXISTS (SELECT 1 FROM emprestimo e WHERE e.livro_id = l.id AND e.cliente_id = c.id);

-- devolvido: Dom Casmurro / Diego Santos
INSERT INTO emprestimo (livro_id, cliente_id, data_emprestimo, data_prevista_devolucao, data_devolucao_real, status)
SELECT l.id, c.id, CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '16 days', CURRENT_TIMESTAMP - INTERVAL '18 days', 'devolvido'
FROM livro l, cliente c
WHERE l.isbn = '9788535910672' AND c.cpf = '44455566677'
AND NOT EXISTS (SELECT 1 FROM emprestimo e WHERE e.livro_id = l.id AND e.cliente_id = c.id);

-- devolvido: Harry Potter e a Pedra Filosofal / Elisa Ramos
INSERT INTO emprestimo (livro_id, cliente_id, data_emprestimo, data_prevista_devolucao, data_devolucao_real, status)
SELECT l.id, c.id, CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '1 days', CURRENT_TIMESTAMP - INTERVAL '2 days', 'devolvido'
FROM livro l, cliente c
WHERE l.isbn = '9788532511010' AND c.cpf = '55566677788'
AND NOT EXISTS (SELECT 1 FROM emprestimo e WHERE e.livro_id = l.id AND e.cliente_id = c.id);
