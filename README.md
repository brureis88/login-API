# API Rest de Login

Esta é uma API Rest simples de Login desenvolvida em Node.js com Express, para fins de estudo de testes de software.

## Estrutura do Projeto

- `server.js`: Responsável por iniciar o servidor Express.
- `src/app.js`: Configuração da aplicação Express (middlewares, rotas, Swagger, etc.).
- `src/routes/`: Contém as definições das rotas da API (ex: `auth.js`).
- `src/controllers/`: Contém os controllers, onde ficam as regras de negócio da API (ex: `authController.js`).

## Funcionalidades
- Realizar login com sucesso
- Retornar erro para login inválido
- Bloquear usuário após 3 tentativas inválidas
- Endpoint para "esqueci minha senha" (desbloqueia e reseta tentativas)

## Como executar

Você pode iniciar a API de duas formas:

1. Usando o comando do npm (recomendado):
   ```bash
   npm start
   ```
   Esse comando utiliza o script configurado no package.json e garante que a inicialização siga o padrão do projeto.

2. Diretamente com Node.js:
   ```bash
   node server.js
   ```
   Esse comando executa diretamente o arquivo responsável por subir o servidor.

A API estará disponível em: `http://localhost:3000`

## Documentação Swagger
Acesse a documentação interativa em:

```
http://localhost:3000/api-docs
```

## Endpoints

### POST /login
Realiza o login do usuário.

**Body:**
```json
{
  "username": "usuario1",
  "password": "senha123"
}
```

**Respostas:**
- 200: Login realizado com sucesso
- 401: Usuário ou senha inválidos
- 423: Usuário bloqueado por tentativas inválidas

### POST /esqueci-senha
Solicita redefinição de senha (desbloqueia o usuário e reseta tentativas).

**Body:**
```json
{
  "username": "usuario1"
}
```

**Respostas:**
- 200: Instruções para redefinição enviadas
- 404: Usuário não encontrado

## Usuário de Teste
- username: `usuario1`
- password: `senha123`

## Observações
- Todos os dados são armazenados em memória, ou seja, ao reiniciar a API, as tentativas e bloqueios são resetados.
- Esta API é apenas para fins de estudo e não deve ser usada em produção. 