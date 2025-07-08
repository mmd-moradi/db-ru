
DROP VIEW IF EXISTS v_historico_transacoes_usuario;
DROP PROCEDURE IF EXISTS p_comprar_ticket;
DROP TABLE IF EXISTS uso_armario, armarios, cardapio_item, itens_cardapio, categorias_item, cardapios, tickets, transacoes, regras_preco, tipos_ticket, funcionarios, restaurantes, grupos_usuario, usuarios CASCADE;


-- ======== CRIACAO DAS TABELAS ========

-- Define os grupos de usuarios para fins de precificacao
CREATE TABLE grupos_usuario (
    grupo_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nome_grupo VARCHAR(100) UNIQUE NOT NULL, -- ex: 'GRUPO I', 'GRUPO II'
    descricao TEXT
);

-- Armazena informacoes dos usuarios (estudantes, professores, etc.)
CREATE TABLE usuarios (
    usuario_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    grupo_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    matricula VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    saldo DECIMAL(10, 2) DEFAULT 0.00,
    foto_perfil BYTEA, -- Campo para dados binarios (foto do usuario)
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (grupo_id) REFERENCES grupos_usuario(grupo_id)
);


-- Armazena informacoes sobre os restaurantes universitarios
CREATE TABLE restaurantes (
    restaurante_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nome_campus VARCHAR(100) NOT NULL,
    localizacao TEXT,
    horario_funcionamento VARCHAR(255)
);

-- Armazena informacoes sobre os funcionarios dos restaurantes
CREATE TABLE funcionarios (
    funcionario_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    restaurante_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    cpf CHAR(11) UNIQUE NOT NULL, 

    cargo VARCHAR(100),
    data_contratacao DATE,
    FOREIGN KEY (restaurante_id) REFERENCES restaurantes(restaurante_id) ON DELETE CASCADE
);

-- Define os diferentes tipos de tickets (refeicoes). 'Refeicao Principal' cobre Almoco e Jantar.
CREATE TABLE tipos_ticket (
    tipo_ticket_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nome_tipo VARCHAR(100) UNIQUE NOT NULL -- ex: 'Cafe da Manha', 'Refeicao Principal'
);

-- Nova tabela para gerenciar precos dinamicos baseado no grupo do usuario e tipo de ticket
CREATE TABLE regras_preco (
    regra_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    grupo_id INT NOT NULL,
    tipo_ticket_id INT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    UNIQUE (grupo_id, tipo_ticket_id),
    FOREIGN KEY (grupo_id) REFERENCES grupos_usuario(grupo_id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_ticket_id) REFERENCES tipos_ticket(tipo_ticket_id) ON DELETE CASCADE
);

-- Registra todas as transacoes financeiras
CREATE TABLE transacoes (
    transacao_id   INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    usuario_id     INT NOT NULL,
    restaurante_id INT,
    valor          DECIMAL(10, 2) NOT NULL,
    tipo_transacao VARCHAR(50)
                   CHECK (tipo_transacao IN ('Compra Ticket', 'Credito RU', 'Estorno')),
    data_hora      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id)     REFERENCES usuarios(usuario_id)     ON DELETE CASCADE,
    FOREIGN KEY (restaurante_id) REFERENCES restaurantes(restaurante_id) ON DELETE CASCADE
);

-- Representa os tickets individuais que os usuarios possuem
CREATE TABLE tickets (
    ticket_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    usuario_id INT NOT NULL,
    transacao_id INT NOT NULL,
    tipo_ticket_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (transacao_id) REFERENCES transacoes(transacao_id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_ticket_id) REFERENCES tipos_ticket(tipo_ticket_id) ON DELETE RESTRICT
);

-- Categorias para os itens do cardapio (ex: 'Prato Principal', 'Bebida', 'Sobremesa')
CREATE TABLE categorias_item (
    categoria_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nome_categoria VARCHAR(100) UNIQUE NOT NULL
);

-- Itens de comida ou bebida especificos
CREATE TABLE itens_cardapio (
    item_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    categoria_id INT NOT NULL,
    nome_item VARCHAR(255) NOT NULL,
    descricao TEXT,
    alergenicos TEXT, -- ex: 'Trigo, Leite e derivados'
    FOREIGN KEY (categoria_id) REFERENCES categorias_item(categoria_id) ON DELETE RESTRICT
);

-- Representa o cardapio para um restaurante, data e refeicao especificos
CREATE TABLE cardapios (
    cardapio_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    restaurante_id INT NOT NULL,
    data_cardapio DATE NOT NULL,
    tipo_refeicao VARCHAR(50) NOT NULL CHECK (tipo_refeicao IN ('Cafe da Manha', 'Almoco', 'Jantar')),
    UNIQUE (restaurante_id, data_cardapio, tipo_refeicao),
    FOREIGN KEY (restaurante_id) REFERENCES restaurantes(restaurante_id) ON DELETE CASCADE
);

-- Tabela de juncao para ligar cardapios com seus respectivos itens (Muitos-para-Muitos)
CREATE TABLE cardapio_item (
    cardapio_id INT NOT NULL,
    item_id INT NOT NULL,
    PRIMARY KEY (cardapio_id, item_id),
    FOREIGN KEY (cardapio_id) REFERENCES cardapios(cardapio_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES itens_cardapio(item_id) ON DELETE CASCADE
);

-- Representa os armarios (guarda-volumes) fisicos
CREATE TABLE armarios (
    armario_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    restaurante_id INT NOT NULL,
    numero_armario VARCHAR(10) NOT NULL,
    status VARCHAR(50) DEFAULT 'Disponivel' CHECK (status IN ('Disponivel', 'Ocupado', 'Manutencao')),
    UNIQUE (restaurante_id, numero_armario),
    FOREIGN KEY (restaurante_id) REFERENCES restaurantes(restaurante_id) ON DELETE CASCADE
);

-- Rastreia o uso dos armarios pelos usuarios
CREATE TABLE uso_armario (
    uso_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    armario_id INT NOT NULL,
    usuario_id INT NOT NULL,
    data_hora_checkin TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_hora_checkout TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (armario_id) REFERENCES armarios(armario_id) ON DELETE RESTRICT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE
);

-- ======== CRIACAO DE VIEW E PROCEDURE ========

CREATE OR REPLACE VIEW v_historico_transacoes_usuario AS
SELECT
    u.usuario_id,
    u.nome AS nome_usuario,
    gu.nome_grupo,
    t.transacao_id,
    t.tipo_transacao,
    t.valor,
    t.data_hora,
    r.nome_campus AS restaurante
FROM
    usuarios u
JOIN
    transacoes t ON u.usuario_id = t.usuario_id
JOIN
    grupos_usuario gu ON u.grupo_id = gu.grupo_id
LEFT JOIN
    restaurantes r ON t.restaurante_id = r.restaurante_id
ORDER BY
    u.usuario_id, t.data_hora DESC
;

-- Procedure revisada para lidar com a compra de ticket com preco dinamico
CREATE OR REPLACE PROCEDURE p_comprar_ticket(
    p_usuario_id      INT,
    p_tipo_ticket_id  INT,
    p_restaurante_id  INT,
    INOUT status_mensagem TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_preco_ticket DECIMAL(10, 2);
    v_saldo_usuario DECIMAL(10, 2);
    v_grupo_usuario_id INT;
    v_nova_transacao_id INT;
BEGIN
    -- Pega o grupo e o saldo do usuario
    SELECT grupo_id, saldo INTO v_grupo_usuario_id, v_saldo_usuario
    FROM usuarios WHERE usuario_id = p_usuario_id;

    IF NOT FOUND THEN
        status_mensagem := 'ERRO: Usuario nao encontrado.';
        RETURN;
    END IF;

    -- Busca o preco na tabela de regras de preco
    SELECT preco INTO v_preco_ticket
    FROM regras_preco
    WHERE grupo_id = v_grupo_usuario_id AND tipo_ticket_id = p_tipo_ticket_id;

    IF NOT FOUND THEN
        status_mensagem := 'ERRO: Preco nao definido para este grupo de usuario e tipo de ticket.';
        RETURN;
    END IF;

    -- Comando condicional: verifica se o saldo e suficiente
    IF v_saldo_usuario >= v_preco_ticket THEN
        -- Subtrai o preco do saldo do usuario
        UPDATE usuarios SET saldo = saldo - v_preco_ticket WHERE usuario_id = p_usuario_id;

        -- Cria um registro de transacao
        INSERT INTO transacoes (usuario_id, restaurante_id, valor, tipo_transacao)
        VALUES (p_usuario_id, p_restaurante_id, v_preco_ticket, 'Compra Ticket')
        RETURNING transacao_id INTO v_nova_transacao_id;

        -- Cria o novo ticket
        INSERT INTO tickets (usuario_id, transacao_id, tipo_ticket_id)
        VALUES (p_usuario_id, v_nova_transacao_id, p_tipo_ticket_id);

        status_mensagem := 'SUCESSO: Compra de ticket realizada com sucesso.';
    ELSE
        status_mensagem := 'FALHA: Saldo insuficiente para realizar a compra.';
    END IF;
END;
$$;
