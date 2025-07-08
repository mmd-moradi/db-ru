-- =================================================================
--                  SCRIPT DE POPULAÇÃO DO BANCO (SEED)
-- =================================================================
-- Este script insere dados iniciais no banco de dados do RU Digital.
-- A ordem de inserção respeita as dependências de chaves estrangeiras.
-- Requisito: Pelo menos 5 registros por tabela. 
-- =================================================================

-- 1. GRUPOS DE USUÁRIO
-- Descrições baseadas nas regras de preço fornecidas.
INSERT INTO grupos_usuario (nome_grupo, descricao) VALUES
('GRUPO I', 'Estudantes de graduação e de pós-graduação stricto sensu, participantes do programa de Assistencia Estudantil. Subsídio de 100%.'),
('GRUPO II', 'Estudantes de graduação e de pós-graduação stricto sensu com renda familiar per capita superior a 1,5 salário mínimo. Subsídio de 60%.'),
('GRUPO III', 'Servidores, terceirizados e visitantes em geral. Sem subsídio.'),
('ADMIN', 'Administradores do sistema com permissões elevadas.'),
('NUTRICIONISTA', 'Funcionários responsáveis pela gestão dos cardápios.');

---

-- 2. RESTAURANTES
-- Inserindo os principais restaurantes da UnB.
INSERT INTO restaurantes (nome_campus, localizacao, horario_funcionamento) VALUES
('Darcy Ribeiro', 'Campus Darcy Ribeiro, ao lado do ICC Norte', 'Café: 07:00-08:30, Almoço: 11:00-14:00, Jantar: 17:30-19:30'),
('Gama (FGA)', 'Campus da Faculdade do Gama', 'Almoço: 11:30-14:00'),
('Ceilândia (FCE)', 'Campus da Faculdade de Ceilândia', 'Almoço: 11:30-14:00'),
('Planaltina (FUP)', 'Campus da Fazenda Água Limpa', 'Almoço: 11:30-14:00'),
('RU da Reitoria', 'Anexo da Reitoria, Darcy Ribeiro', 'Apenas Almoço: 12:00-14:00');

---

-- 3. CATEGORIAS DE ITEM
-- Categorias extraídas do cardápio semanal fornecido. [cite: 22, 25, 29]
INSERT INTO categorias_item (nome_categoria) VALUES
('BEBIDAS'),
('PANIFICACAO'),
('COMPLEMENTO PADRAO'),
('COMPLEMENTO OVOLACTOVEGETARIANO'),
('COMPLEMENTO VEGETARIANO ESTRITO'),
('FRUTA'),
('SALADA 1'),
('SALADA 2'),
('PRATO PRINCIPAL PADRAO'),
('PRATO PRINCIPAL OVOLACTOVEGETARIANO'),
('PRATO PRINCIPAL VEGETARIANO ESTRITO'),
('GUARNIÇÃO'),
('ACOMPANHAMENTOS'),
('SOBREMESA'),
('SOPA');

---

-- 4. TIPOS DE TICKET
-- Tipos de refeição que podem ser comprados.
INSERT INTO tipos_ticket (nome_tipo) VALUES
('Cafe da Manha'),
('Refeicao Principal'); -- Cobre Almoço e Jantar

---

-- 5. REGRAS DE PREÇO
-- Preços baseados nas regras fornecidas para cada grupo e tipo de ticket.
-- Grupo I (ISENTO)
INSERT INTO regras_preco (grupo_id, tipo_ticket_id, preco) VALUES
((SELECT grupo_id FROM grupos_usuario WHERE nome_grupo = 'GRUPO I'), (SELECT tipo_ticket_id FROM tipos_ticket WHERE nome_tipo = 'Cafe da Manha'), 0.00),
((SELECT grupo_id FROM grupos_usuario WHERE nome_grupo = 'GRUPO I'), (SELECT tipo_ticket_id FROM tipos_ticket WHERE nome_tipo = 'Refeicao Principal'), 0.00),
-- Grupo II
((SELECT grupo_id FROM grupos_usuario WHERE nome_grupo = 'GRUPO II'), (SELECT tipo_ticket_id FROM tipos_ticket WHERE nome_tipo = 'Cafe da Manha'), 2.85),
((SELECT grupo_id FROM grupos_usuario WHERE nome_grupo = 'GRUPO II'), (SELECT tipo_ticket_id FROM tipos_ticket WHERE nome_tipo = 'Refeicao Principal'), 6.10),
-- Grupo III
((SELECT grupo_id FROM grupos_usuario WHERE nome_grupo = 'GRUPO III'), (SELECT tipo_ticket_id FROM tipos_ticket WHERE nome_tipo = 'Cafe da Manha'), 7.05),
((SELECT grupo_id FROM grupos_usuario WHERE nome_grupo = 'GRUPO III'), (SELECT tipo_ticket_id FROM tipos_ticket WHERE nome_tipo = 'Refeicao Principal'), 15.20);

---

-- 6. USUÁRIOS
-- Senha para todos os usuários é 'senha123'
-- Hash gerado com bcrypt (custo 10) para 'senha123': $2a$10$5bQZ.bY2.e58Gj9g2t/TKO9VnLc72GCRj3nZ7aMv3Zm2l1u2w9Gv.
-- NOTA: O campo foto_perfil (BYTEA) é deixado como NULL. A inserção de dados binários deve ser feita pela API.
INSERT INTO usuarios (grupo_id, nome, matricula, email, senha_hash, saldo) VALUES
((SELECT grupo_id FROM grupos_usuario WHERE nome_grupo = 'GRUPO II'), 'Ana Clara Souza', '200012345', 'ana.souza@aluno.unb.br', '$2a$10$5bQZ.bY2.e58Gj9g2t/TKO9VnLc72GCRj3nZ7aMv3Zm2l1u2w9Gv.', 50.00),
((SELECT grupo_id FROM grupos_usuario WHERE nome_grupo = 'GRUPO I'), 'Bruno Carvalho', '210054321', 'bruno.carvalho@aluno.unb.br', '$2a$10$5bQZ.bY2.e58Gj9g2t/TKO9VnLc72GCRj3nZ7aMv3Zm2l1u2w9Gv.', 15.50),
((SELECT grupo_id FROM grupos_usuario WHERE nome_grupo = 'GRUPO III'), 'Carlos Andrade (Servidor)', '1098765', 'carlos.andrade@unb.br', '$2a$10$5bQZ.bY2.e58Gj9g2t/TKO9VnLc72GCRj3nZ7aMv3Zm2l1u2w9Gv.', 100.00),
((SELECT grupo_id FROM grupos_usuario WHERE nome_grupo = 'GRUPO II'), 'Daniela Ferreira', '220067890', 'daniela.ferreira@aluno.unb.br', '$2a$10$5bQZ.bY2.e58Gj9g2t/TKO9VnLc72GCRj3nZ7aMv3Zm2l1u2w9Gv.', 25.00),
((SELECT grupo_id FROM grupos_usuario WHERE nome_grupo = 'GRUPO II'), 'Eduardo Lima', '190011223', 'eduardo.lima@aluno.unb.br', '$2a$10$5bQZ.bY2.e58Gj9g2t/TKO9VnLc72GCRj3nZ7aMv3Zm2l1u2w9Gv.', 0.00),
((SELECT grupo_id FROM grupos_usuario WHERE nome_grupo = 'ADMIN'), 'Adminstrador Sistema', 'admin', 'admin@unb.br', '$2a$10$5bQZ.bY2.e58Gj9g2t/TKO9VnLc72GCRj3nZ7aMv3Zm2l1u2w9Gv.', 999.00);


---

-- 7. FUNCIONÁRIOS
INSERT INTO funcionarios (restaurante_id, nome, cpf, cargo, data_contratacao) VALUES
((SELECT restaurante_id FROM restaurantes WHERE nome_campus = 'Darcy Ribeiro'), 'Fernanda Costa', '11122233344', 'Gerente', '2022-08-15'),
((SELECT restaurante_id FROM restaurantes WHERE nome_campus = 'Darcy Ribeiro'), 'Gustavo Martins', '22233344455', 'Cozinheiro Chefe', '2021-03-20'),
((SELECT restaurante_id FROM restaurantes WHERE nome_campus = 'Darcy Ribeiro'), 'Heloísa Pereira', '33344455566', 'Nutricionista', '2023-01-10'),
((SELECT restaurante_id FROM restaurantes WHERE nome_campus = 'Gama (FGA)'), 'Igor Santos', '44455566677', 'Atendente', '2023-05-01'),
((SELECT restaurante_id FROM restaurantes WHERE nome_campus = 'Ceilândia (FCE)'), 'Juliana Almeida', '55566677788', 'Auxiliar de Cozinha', '2023-07-22');

---

-- 8. ITENS DE CARDÁPIO
-- Itens extraídos do cardápio da semana de 07/07 a 13/07. [cite: 22, 25, 29]
-- Café da Manhã Itens
INSERT INTO itens_cardapio (categoria_id, nome_item) VALUES
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'BEBIDAS'), 'Café'),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'BEBIDAS'), 'Chá'),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'BEBIDAS'), 'Leite integral'),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'BEBIDAS'), 'Chocolate quente'),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'PANIFICACAO'), 'Pão francês'),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'PANIFICACAO'), 'Pão careca'),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'PANIFICACAO'), 'Pão integral'),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'COMPLEMENTO PADRAO'), 'Frango desfiado'),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'COMPLEMENTO PADRAO'), 'Carne moída'),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'COMPLEMENTO OVOLACTOVEGETARIANO'), 'Queijo minas'),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'COMPLEMENTO VEGETARIANO ESTRITO'), 'Cachorro-quente vegetariano'),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'FRUTA'), 'Maçã'),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'FRUTA'), 'Banana'),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'FRUTA'), 'Melão');

-- Almoço/Jantar Itens
INSERT INTO itens_cardapio (categoria_id, nome_item, alergenicos) VALUES
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'SALADA 1'), 'Alface crespa', NULL),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'SALADA 2'), 'Tomate', NULL),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'PRATO PRINCIPAL PADRAO'), 'Strogonoff de frango', 'Leite e derivados'),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'PRATO PRINCIPAL OVOLACTOVEGETARIANO'), 'Strogonoff vegetariano', 'Leite e derivados, Soja'),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'PRATO PRINCIPAL VEGETARIANO ESTRITO'), 'Moqueca de banana da terra com grão de bico', NULL),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'GUARNIÇÃO'), 'Batata assada', NULL),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'ACOMPANHAMENTOS'), 'Arroz branco', NULL),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'ACOMPANHAMENTOS'), 'Arroz integral', NULL),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'ACOMPANHAMENTOS'), 'Feijão preto', NULL),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'SOBREMESA'), 'Mix de doces', 'Trigo, Leite e derivados'),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'PRATO PRINCIPAL PADRAO'), 'Carne ao molho de vinho', 'Trigo'),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'PRATO PRINCIPAL VEGETARIANO ESTRITO'), 'Polpetone de quinoa', 'Soja'),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'PRATO PRINCIPAL PADRAO'), 'Feijoada', 'Suíno'),
((SELECT categoria_id FROM categorias_item WHERE nome_categoria = 'SOPA'), 'Sopa de ervilha', NULL);

---

-- 9. CARDÁPIOS (SHELLS)
-- Criando os cardápios para alguns dias da semana de exemplo. [cite: 21]
INSERT INTO cardapios (restaurante_id, data_cardapio, tipo_refeicao) VALUES
((SELECT restaurante_id FROM restaurantes WHERE nome_campus = 'Darcy Ribeiro'), '2025-07-07', 'Cafe da Manha'), -- ID 1
((SELECT restaurante_id FROM restaurantes WHERE nome_campus = 'Darcy Ribeiro'), '2025-07-07', 'Almoco'),      -- ID 2
((SELECT restaurante_id FROM restaurantes WHERE nome_campus = 'Darcy Ribeiro'), '2025-07-07', 'Jantar'),     -- ID 3
((SELECT restaurante_id FROM restaurantes WHERE nome_campus = 'Darcy Ribeiro'), '2025-07-08', 'Almoco'),      -- ID 4
((SELECT restaurante_id FROM restaurantes WHERE nome_campus = 'Gama (FGA)'), '2025-07-08', 'Almoco');       -- ID 5

---

-- 10. CARDÁPIO-ITEM (ASSOCIAÇÕES)
-- Populando o cardápio de Almoço de Segunda-Feira (07/07/2025) [cite: 25]
INSERT INTO cardapio_item (cardapio_id, item_id) VALUES
(2, (SELECT item_id FROM itens_cardapio WHERE nome_item = 'Alface crespa')),
(2, (SELECT item_id FROM itens_cardapio WHERE nome_item = 'Tomate')),
(2, (SELECT item_id FROM itens_cardapio WHERE nome_item = 'Strogonoff de frango')),
(2, (SELECT item_id FROM itens_cardapio WHERE nome_item = 'Strogonoff vegetariano')),
(2, (SELECT item_id FROM itens_cardapio WHERE nome_item = 'Moqueca de banana da terra com grão de bico')),
(2, (SELECT item_id FROM itens_cardapio WHERE nome_item = 'Batata assada')),
(2, (SELECT item_id FROM itens_cardapio WHERE nome_item = 'Arroz branco')),
(2, (SELECT item_id FROM itens_cardapio WHERE nome_item = 'Arroz integral')),
(2, (SELECT item_id FROM itens_cardapio WHERE nome_item = 'Feijão preto')),
(2, (SELECT item_id FROM itens_cardapio WHERE nome_item = 'Mix de doces'));

-- Populando o cardápio de Almoço de Terça-Feira (08/07/2025) [cite: 25]
INSERT INTO cardapio_item (cardapio_id, item_id) VALUES
(4, (SELECT item_id FROM itens_cardapio WHERE nome_item = 'Carne ao molho de vinho')),
(4, (SELECT item_id FROM itens_cardapio WHERE nome_item = 'Polpetone de quinoa'));

---

-- 11. ARMÁRIOS
INSERT INTO armarios (restaurante_id, numero_armario, status) VALUES
((SELECT restaurante_id FROM restaurantes WHERE nome_campus = 'Darcy Ribeiro'), 'A01', 'Disponivel'),
((SELECT restaurante_id FROM restaurantes WHERE nome_campus = 'Darcy Ribeiro'), 'A02', 'Ocupado'),
((SELECT restaurante_id FROM restaurantes WHERE nome_campus = 'Darcy Ribeiro'), 'A03', 'Manutencao'),
((SELECT restaurante_id FROM restaurantes WHERE nome_campus = 'Darcy Ribeiro'), 'B01', 'Disponivel'),
((SELECT restaurante_id FROM restaurantes WHERE nome_campus = 'Darcy Ribeiro'), 'B02', 'Disponivel');

---

-- 12. TRANSAÇÕES E TICKETS
-- Inserindo algumas transações de crédito para dar saldo inicial aos usuários.
-- NOTA: Transações de 'Compra Ticket' e os tickets correspondentes devem ser criados pela API
-- para testar a procedure 'p_comprar_ticket', e não inseridos manualmente aqui.
INSERT INTO transacoes(usuario_id, restaurante_id, valor, tipo_transacao) VALUES
(1, 1, 50.00, 'Credito RU'), -- Ana Clara
(2, 1, 15.50, 'Credito RU'), -- Bruno Carvalho
(3, 1, 100.00, 'Credito RU'), -- Carlos Andrade
(4, 1, 25.00, 'Credito RU'); -- Daniela Ferreira

---

-- 13. USO DE ARMÁRIO
-- Populando um exemplo de armário em uso
INSERT INTO uso_armario (armario_id, usuario_id, data_hora_checkin) VALUES
(2, 1, '2025-07-08 09:30:00-03'); -- Armário A02 ocupado por Ana Clara

---
-- FIM DO SCRIPT DE SEED
---