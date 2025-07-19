# API Teste

Esta API foi desenvolvida com Node.js, Express e Prisma ORM.

## Requisitos
- Node.js v16 ou superior
- MongoDB (ou outro banco configurado no Prisma)

## Instalação

1. Clone o repositório ou baixe os arquivos.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o arquivo `.env` com a variável `DATABASE_URL` para seu banco de dados.

   Exemplo: DATABASE_URL="mongodb+srv://{NOME DO USUARIO}:{SENHA}@{NOME DO BANCO}.p4c09a3.mongodb.net/users?retryWrites=true&w=majority&appName=users"

4. Gere o Prisma Client:
   ```bash
   npx prisma generate
   ```
5. (Opcional) Sincronize o schema com o banco:
   ```bash
   npx prisma db push
   ```

## Execução

Inicie o servidor:
```bash
node server.js
```

## Endpoints

### GET /usuarios
Lista usuários. Aceita filtros por `name`, `email` e `age` via query string.

### POST /usuarios
Cria um novo usuário. Envie `name`, `email` e `age` no corpo da requisição.

### PUT /usuarios/:id
Atualiza um usuário pelo `id`. Envie os campos para atualizar no corpo da requisição.

### DELETE /usuarios/:id
Remove um usuário pelo `id`.

## Documentação de Execução

### Pré-requisitos
- Node.js instalado (versão recomendada: 18 ou superior)
- Docker e Docker Compose instalados (opcional)

### Instalação e Execução Local

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Comandos para executar a aplicação:
   ```bash
   npm start
   ```
   Ou diretamente:
   ```bash
   node server.js
   ```
    Execute para ver o banco:
   ```bash
   npx prisma studio 
   ```

### Execução com Docker

1. Construa e inicie os containers:
   ```bash
   docker-compose up --build
   ```
2. Acesse a aplicação conforme instruções do terminal (geralmente em `http://localhost:3000` ou porta definida no projeto).

## Observações
- Certifique-se de que o banco de dados está rodando e acessível.
- O Prisma Client deve ser gerado sempre que o schema for alterado.
- Certifique-se de configurar variáveis de ambiente se necessário.
- Para uso com banco de dados, configure o arquivo `prisma/schema.prisma` e execute as migrações conforme a necessidade.

---

Para mais detalhes, consulte a documentação dos arquivos `Dockerfile`, `docker-compose.yml` e `prisma/schema.prisma`.

## Tutorial de Exploração de Vulnerabilidades (PoC)

### 1. Execução Arbitrária de Código (`/eval`)
- Faça um POST para `http://localhost:3000/eval` com o body:
  ```json
  {
    "code": "process.exit()"
  }
  ```
- Isso fará a aplicação parar imediatamente.

### 2. Vazamento de Informação Sensível (`/token`)
- Faça um GET em `http://localhost:3000/token`
- O endpoint retorna um token hardcoded, simulando vazamento de segredo.

### 3. NoSQL Injection (`/insecure`)
- Faça um GET em:
  ```
  http://localhost:3000/insecure?name[$ne]=
  ```
- O endpoint retorna todos os usuários do banco, explorando a vulnerabilidade de NoSQL Injection.

> **Atenção:** Esses exemplos são apenas para fins educativos e devem ser usados somente em ambiente de testes!


