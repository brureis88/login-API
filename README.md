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
- Fluxo completo de redefinição de senha com código de verificação
- Armazenamento dos dados em memória (não utiliza banco de dados)
- Comunicação via JSON
- Documentação interativa via Swagger

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

### POST /solicitar-redefinicao
Solicita um código de redefinição de senha (primeira etapa do fluxo).

**Body:**
```json
{
  "username": "usuario1"
}
```

**Respostas:**
- 200: Código enviado com sucesso (inclui email e código para demonstração)
- 404: Usuário não encontrado

### POST /validar-codigo
Valida o código de redefinição recebido (segunda etapa do fluxo).

**Body:**
```json
{
  "username": "usuario1",
  "codigo": "123456"
}
```

**Respostas:**
- 200: Código válido
- 400: Código inválido, expirado ou já utilizado

### POST /redefinir-senha
Redefine a senha com o código validado (terceira etapa do fluxo).

**Body:**
```json
{
  "username": "usuario1",
  "codigo": "123456",
  "novaSenha": "novaSenha123"
}
```

**Respostas:**
- 200: Senha redefinida com sucesso
- 400: Código inválido ou não validado
- 404: Usuário não encontrado

### POST /esqueci-senha
Endpoint legado - Redireciona para o novo fluxo de redefinição (`/solicitar-redefinicao`).

**Body:**
```json
{
  "username": "usuario1"
}
```

**Respostas:**
- 200: Código enviado com sucesso (inclui email e código para demonstração)
- 404: Usuário não encontrado

## Fluxo de Redefinição de Senha

1. **Solicitar redefinição** (`/solicitar-redefinicao` ou `/esqueci-senha`)
   - Gera código único de 6 dígitos
   - Simula envio por email
   - Código expira em 10 minutos
   - **Usuário permanece bloqueado** (se estiver bloqueado)

2. **Validar código** (`/validar-codigo`)
   - Verifica se o código é válido
   - Verifica se não expirou
   - Verifica se não foi usado anteriormente
   - Marca código como usado

3. **Redefinir senha** (`/redefinir-senha`)
   - Altera a senha do usuário
   - **Desbloqueia conta** automaticamente
   - Reseta contador de tentativas
   - Remove código usado

## Regras de Negócio

### Login
- Usuário pode tentar login até 3 vezes
- Após 3 tentativas inválidas, conta é bloqueada
- Login bem-sucedido reseta contador de tentativas

### Bloqueio de Conta
- Conta é bloqueada após 3 tentativas inválidas
- Usuário bloqueado não pode fazer login
- Apenas redefinição de senha desbloqueia a conta

### Códigos de Redefinição
- Códigos são únicos e de 6 dígitos
- Expiração: 10 minutos após geração
- Uso único: após validação, código não pode ser reutilizado
- Simulação de envio por email (logs no console)

### Redefinição de Senha
- Requer código válido e não expirado
- Desbloqueia conta automaticamente
- Reseta contador de tentativas
- Remove código usado após redefinição

## Usuário de Teste
- username: `usuario1`
- password: `senha123`

## Observações
- Todos os dados são armazenados em memória, ou seja, ao reiniciar a API, as tentativas, bloqueios e códigos são resetados.
- Esta API é apenas para fins de estudo e não deve ser usada em produção.
- Códigos de redefinição são exibidos no console para facilitar testes. 