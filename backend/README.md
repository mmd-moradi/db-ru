# Backend - Banco de Dados para Restaurantes Universitários

Este é o repositório do backend para o projeto da disciplina de Banco de Dados. O projeto utiliza uma stack com Node.js, Express, TypeScript e SQL puro para se conectar a um banco de dados relacional.

## Stack Principal

-   **Node.js**: Ambiente de execução JavaScript.
-   **Express.js**: Framework para construção do servidor e das rotas da API.
-   **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
-   **PostgreSQL**: Banco de dados relacional (pode ser substituído por outro SGBD relacional).
-   **pnpm**: Gerenciador de pacotes.

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

-   **`sql/`**: Contém os scripts `.sql` para inicializar o banco de dados. Execute-os antes de iniciar a aplicação pela primeira vez.
-   **`src/api/`**: Cada arquivo aqui define um grupo de rotas (ex: `restaurante.routes.ts`). É aqui que a documentação Swagger é escrita usando comentários JSDoc.
-   **`src/controllers/`**: Faz a ponte entre as rotas e os serviços. Ele extrai dados da requisição (`req`), chama o serviço apropriado e formata a resposta (`res`).
-   **`src/services/`**: Onde a "mágica" acontece. Contém as funções com as queries SQL para interagir com o banco de dados (CRUD: Create, Read, Update, Delete).
-   **`src/db/`**: Configura e exporta o *pool* de conexões com o banco de dados, garantindo uma gestão eficiente das conexões.

## Pré-requisitos

Antes de começar, garanta que você tenha instalado:

-   [Node.js](https://nodejs.org/) (versão 18 ou superior)
-   [pnpm](https://pnpm.io/installation)
-   Um servidor de banco de dados PostgreSQL (ou o SGBD de sua escolha) rodando localmente ou em um container Docker.

## Como Rodar o Projeto

1.  **Clone o repositório e navegue até a pasta do backend:**

    ```bash
    git clone <url-do-repositorio>
    cd <nome-do-projeto>/backend
    ```

2.  **Instale as dependências:**

    ```bash
    pnpm install
    ```

3.  **Configure as variáveis de ambiente:**
    -   Crie um novo arquivo chamado `.env` na raiz da pasta `/backend`.
    -   Adicione a URL de conexão do seu banco de dados:
        ```
        # .env
        PORT=3001
        DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/banco_restaurantes_unb"
        ```

4.  **Prepare o Banco de Dados:**
    -   Crie o banco de dados no seu SGBD com o nome que você definiu na `DATABASE_URL`.
    -   Execute o script `sql/init.sql` no seu banco de dados para criar as tabelas iniciais. O projeto deve conter no mínimo 10 entidades e cada uma deve ter no mínimo 5 registros.

5.  **Inicie o servidor de desenvolvimento:**

    ```bash
    pnpm dev
    ```

    O servidor estará rodando em `http://localhost:3001`.

## Documentação da API (Swagger)

A API é autodocumentada usando Swagger. Com o servidor rodando, acesse a seguinte URL no seu navegador para ver a documentação interativa:

-   **`http://localhost:3001/api-docs`**

Você poderá ver todos os endpoints, seus parâmetros, e até mesmo testá-los diretamente pela interface do Swagger.
