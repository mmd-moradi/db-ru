# Sistema de Restaurante Universitário (RU)

Este é um projeto fullstack para gerenciamento de um Restaurante Universitário, desenvolvido com Node.js/Express no backend e React no frontend.

## Modelagem


## Telas



## Estrutura do Projeto

O projeto está dividido em duas pastas principais:

- **`backend/`**: API REST desenvolvida com Node.js, Express, TypeScript e PostgreSQL
- **`frontend/`**: Interface de usuário desenvolvida com React, TypeScript e bibliotecas modernas

## Requisitos

Para executar este projeto, você precisará ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [pnpm](https://pnpm.io/installation) (gerenciador de pacotes)
- [Docker](https://www.docker.com/products/docker-desktop/) (para o banco de dados PostgreSQL)

Este é um projeto fullstack para gerenciamento de um Restaurante Universitário, desenvolvido com Node.js/Express no backend e React no frontend.

## Estrutura do Projeto

O projeto está dividido em duas pastas principais:

- **`backend/`**: API REST desenvolvida com Node.js, Express, TypeScript e PostgreSQL
- **`frontend/`**: Interface de usuário desenvolvida com React, TypeScript e bibliotecas modernas

## Requisitos

Para executar este projeto, você precisará ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [pnpm](https://pnpm.io/installation) (gerenciador de pacotes)
- [Docker](https://www.docker.com/products/docker-desktop/) (para o banco de dados PostgreSQL)

## Como Executar o Projeto

### 1. Configurando e Iniciando o Backend

#### 1.1 Configuração do Ambiente

1. Navegue até a pasta `backend`:

```bash
cd backend
```

2. Crie um arquivo `.env` com o seguinte conteúdo:

```
PORT=3001
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/ru"
```

#### 1.2 Iniciando o Banco de Dados

1. A partir da pasta `backend`, inicie o container Docker do PostgreSQL:

```bash
docker-compose up -d
```

> **Nota**: Na primeira execução, o Docker irá executar automaticamente os scripts SQL localizados na pasta `sql/` para inicializar o banco de dados.

#### 1.3 Instalando Dependências e Iniciando o Servidor

1. Instale as dependências:

```bash
pnpm install
```

2. Inicie o servidor de desenvolvimento:

```bash
pnpm dev
```

O backend estará rodando em `http://localhost:3001`.

### 2. Configurando e Iniciando o Frontend

#### 2.1 Instalando Dependências

1. Abra um novo terminal e navegue até a pasta `frontend`:

```bash
cd frontend
```

2. Instale as dependências:

```bash
pnpm install
```

#### 2.2 Iniciando o Servidor de Desenvolvimento

```bash
pnpm dev
```

O frontend estará disponível em `http://localhost:5173` (ou outra porta indicada no terminal).

## Documentação da API

A documentação da API está disponível através do Swagger UI. Com o backend em execução, acesse:

- [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

## Comandos Úteis

### Docker (Banco de Dados)

- **Para parar o container do banco de dados**:
  ```bash
  docker-compose down
  ```

- **Para visualizar logs do banco de dados**:
  ```bash
  docker-compose logs -f postgres
  ```

- **Para remover completamente o container e os dados**:
  ```bash
  docker-compose down -v
  ```

### Testes end-to-end

O projeto inclui testes de integração para o backend utilizando shUnit2:

#### Requisitos para os testes

1. O container PostgreSQL deve estar em execução
2. O backend deve estar rodando em `localhost:3001`
3. O pacote `shunit2` deve estar instalado (`sudo apt install shunit2`)
4. O utilitário `jq` deve estar instalado (`sudo apt install jq`)

#### Executando os testes

```bash
cd backend
./tests/crud_test.sh
```

## Estrutura do Banco de Dados

O sistema utiliza um banco de dados PostgreSQL com tabelas para gerenciar restaurantes, usuários, tickets, menus, transações, armários, entre outros recursos.

## Desenvolvimento

- **Backend**: Node.js, Express, TypeScript, PostgreSQL
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Radix UI
- **Ferramentas**: Docker, pnpm, ESLint, Prettier

---

Desenvolvido para o projeto da disciplina de Banco de Dados da Universidade de Brasília.
