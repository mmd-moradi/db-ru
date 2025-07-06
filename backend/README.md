# Backend - Banco de Dados para Restaurantes Universitários

Este é o repositório do backend para o projeto da disciplina de Banco de Dados. O projeto utiliza uma stack com Node.js, Express, TypeScript e SQL puro para se conectar a um banco de dados PostgreSQL, com o ambiente de desenvolvimento gerenciado por Docker.

## Stack Principal

-   **Node.js**: Ambiente de execução JavaScript.
-   **Express.js**: Framework para construção do servidor e das rotas da API.
-   **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
-   **PostgreSQL**: Banco de dados relacional rodando em um container Docker.
-   **Docker & Docker Compose**: Ferramentas para criação e gerenciamento do ambiente de desenvolvimento.
-   **pnpm**: Gerenciador de pacotes.

---

## Estrutura de Pastas

A estrutura do projeto foi pensada para ser escalável e organizada, separando as responsabilidades:

```
/backend
├── sql/
│   └── init.sql         # Scripts SQL para criar tabelas, views, etc.
├── src/
│   ├── api/             # Definição das rotas da API com Express Router.
│   ├── config/          # Arquivos de configuração (ex: Swagger).
│   ├── controllers/     # Controladores: recebem as requisições e enviam as respostas.
│   ├── services/        # Serviços: contêm a lógica de negócio e as queries SQL.
│   ├── db/              # Configuração da conexão com o banco de dados.
│   └── server.ts        # Ponto de entrada do servidor Express.
├── .env                 # Arquivo para variáveis de ambiente (NÃO versionado).
├── package.json         # Dependências e scripts do projeto.
└── tsconfig.json        # Configurações do compilador TypeScript.
```

-   **`sql/`**: Contém os scripts `.sql` para inicializar o banco de dados. **Este diretório é montado no Docker e executado automaticamente na primeira inicialização do container.**
-   **`src/api/`**: Cada arquivo aqui define um grupo de rotas (ex: `restaurante.routes.ts`). É aqui que a documentação Swagger é escrita usando comentários JSDoc.
-   **`src/controllers/`**: Faz a ponte entre as rotas e os serviços. Ele extrai dados da requisição (`req`), chama o serviço apropriado e formata a resposta (`res`).
-   **`src/services/`**: Onde a lógica de negócio reside. Contém as funções com as queries SQL para interagir com o banco de dados (CRUD: Create, Read, Update, Delete).
-   **`src/db/`**: Configura e exporta o *pool* de conexões com o banco de dados.

---

## Como Rodar o Projeto (Ambiente Docker)

Para garantir um ambiente de desenvolvimento consistente para toda a equipe, o uso de Docker para o banco de dados é o método padrão.

### Pré-requisitos

-   [Node.js](https://nodejs.org/) (versão 18 ou superior)
-   [pnpm](https://pnpm.io/installation)
-   [Docker](https://www.docker.com/products/docker-desktop/) instalado e em execução na sua máquina.

### Passos para Iniciar

1.  **Clone o repositório:**

    ```bash
    git clone <url-do-repositorio>
    cd <nome-do-projeto>
    ```

2.  **Configure as Variáveis de Ambiente do Backend:**
    -   Navegue até a pasta `backend`.
    -   Crie um arquivo `.env` e adicione as seguintes variáveis. **Elas devem ser idênticas às definidas no arquivo `docker-compose.yml` na raiz do projeto.**

        ```
        # /backend/.env
        PORT=3001
        DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/ru"
        ```

3.  **Inicie o Container do Banco de Dados:**
    -   Volte para a **raiz do projeto** (a pasta que contém `docker-compose.yml`).
    -   Execute o seguinte comando para iniciar o container do PostgreSQL em segundo plano:

        ```bash
        docker-compose up -d
        ```
    -   **Execução do `init.sql`**: Na primeira vez que você executar este comando, o Docker irá baixar a imagem do PostgreSQL, criar o container e **executar automaticamente todos os scripts do diretório `backend/sql`**, configurando o banco de dados. Nas vezes seguintes, ele apenas iniciará o container existente, preservando todos os dados.

4.  **Instale as Dependências e Inicie o Servidor Backend:**
    -   Navegue até a pasta `backend`.
    -   Instale as dependências e inicie o servidor:
        ```bash
        cd backend
        pnpm install
        pnpm dev
        ```

O servidor do backend estará rodando em `http://localhost:3001` e conectado ao banco de dados no container Docker.

---

## Documentação da API (Swagger)

A API é autodocumentada usando Swagger. Com o servidor rodando, acesse a seguinte URL no seu navegador para ver a documentação interativa, testar os endpoints e ver os modelos de dados:

-   **URL:** [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

---

## Comandos Úteis do Docker

Execute estes comandos a partir da **raiz do projeto**.

-   **Para parar o container do banco de dados:**
    ```bash
    docker-compose down   ou docker compose
    ```
-   **Para ver os logs do banco de dados em tempo real:**
    ```bash
    docker-compose logs -f postgres
    ```
-   **Para apagar completamente o container e os dados do banco de dados (use com cuidado!):**
    ```bash
    docker-compose down -v
    