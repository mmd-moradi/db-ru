CREATE TABLE CategoriaTicket (
    CategoriaTicketID  SERIAL PRIMARY KEY,
    GrupoUsuario       VARCHAR(50)  NOT NULL,
    TipoRefeicao       VARCHAR(50)  NOT NULL,
    Preco              DECIMAL(10,2) NOT NULL
);

CREATE TABLE Usuario (
    UsuarioID   SERIAL PRIMARY KEY,
    Nome        VARCHAR(100) NOT NULL,
    Matricula   VARCHAR(20)  NOT NULL,
    GrupoUsuario CHAR(1)     NOT NULL,
    SaldoAtual  DECIMAL(10,2) DEFAULT 0,
    Foto        BYTEA,
    SenhaHash   VARCHAR(255) NOT NULL
);

CREATE TABLE Restaurante (
    RestauranteID SERIAL PRIMARY KEY,
    Localizacao   VARCHAR(100) NOT NULL,
    NomeCampus    VARCHAR(100) NOT NULL
);

CREATE TABLE Transacao (
    TransacaoID   SERIAL PRIMARY KEY,
    Valor         DECIMAL(10,2) NOT NULL,
    DataHora      TIMESTAMP     NOT NULL,
    TipoTransacao VARCHAR(20)   NOT NULL,
    UsuarioID     INT           REFERENCES Usuario(UsuarioID),
    RestauranteID INT           REFERENCES Restaurante(RestauranteID)
);

CREATE TABLE Ticket (
    TicketID         SERIAL PRIMARY KEY,
    DataCompra       TIMESTAMP NOT NULL,
    DataUso          TIMESTAMP,
    Status           VARCHAR(20),
    TransacaoID      INT  REFERENCES Transacao(TransacaoID),
    CategoriaTicketID INT REFERENCES CategoriaTicket(CategoriaTicketID)
);

CREATE TABLE ChaveGuardaVolumes (
    IDUsoGuardaVolumes SERIAL PRIMARY KEY,
    NumeroChave        INT        NOT NULL,
    DataHoraArmazenamento TIMESTAMP NOT NULL,
    DataHoraRetorno       TIMESTAMP
);

CREATE TABLE Usa (
    UsuarioID          INT REFERENCES Usuario(UsuarioID),
    IDUsoGuardaVolumes INT REFERENCES ChaveGuardaVolumes(IDUsoGuardaVolumes),
    PRIMARY KEY (UsuarioID, IDUsoGuardaVolumes)
);

CREATE TABLE Funcionario (
    FuncionarioID SERIAL PRIMARY KEY,
    Nome          VARCHAR(100) NOT NULL,
    CPF           VARCHAR(14)  NOT NULL,
    Cargo         VARCHAR(50)  NOT NULL,
    RestauranteID INT REFERENCES Restaurante(RestauranteID)
);

CREATE TABLE Cardapio (
    CardapioID    SERIAL PRIMARY KEY,
    TipoRefeicao  VARCHAR(50) NOT NULL,
    Data          TIMESTAMP   NOT NULL,
    RestauranteID INT         REFERENCES Restaurante(RestauranteID)
);

CREATE TABLE CategoriaItem (
    CategoriaItemID SERIAL PRIMARY KEY,
    NomeCategoria   VARCHAR(50) NOT NULL
);

CREATE TABLE Item (
    ItemID           SERIAL PRIMARY KEY,
    NomeItem         VARCHAR(100) NOT NULL,
    Descricao        TEXT,
    Alergenicos      VARCHAR(100),
    CategoriaItemID  INT REFERENCES CategoriaItem(CategoriaItemID)
);

CREATE TABLE Tem (
    CardapioID INT REFERENCES Cardapio(CardapioID),
    ItemID     INT REFERENCES Item(ItemID),
    PRIMARY KEY (CardapioID, ItemID)
);
