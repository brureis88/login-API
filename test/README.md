# 🧪 Testes da API de Login

Este diretório contém os testes automatizados para a API de Login, focados em cenários de regressão, validação e fluxos completos de autenticação.

## 📁 Estrutura

```
test/
├── helpers/
│   └── testHelper.js          # Configurações e helpers comuns
├── integration/
│   └── auth.test.js           # Testes de integração dos endpoints de auth
├── mocha.opts                 # Configuração do Mocha
└── README.md                  # Esta documentação
```

## 🚀 Como Executar

### Executar todos os testes
```bash
npm test
```

### Executar testes específicos
```bash
# Apenas testes de autenticação
npx mocha test/integration/auth.test.js

# Executar com relatório detalhado
npx mocha test/**/*.test.js --reporter spec --timeout 10000
```

## 📋 Cenários de Teste

### 🔐 Testes de Autenticação (`auth.test.js`)

#### POST /login
- ✅ **Login com credenciais válidas**: Verifica login bem-sucedido
- ❌ **Login com usuário inexistente**: Valida rejeição de usuário não cadastrado
- ❌ **Login com senha incorreta**: Testa rejeição de senha inválida
- ❌ **Campos obrigatórios ausentes**: Valida rejeição de requisições incompletas
- 🚫 **Bloqueio após 3 tentativas inválidas**: Testa sistema de proteção contra força bruta
- 🚫 **Rejeição de usuário bloqueado**: Verifica que usuários bloqueados não conseguem fazer login

#### POST /solicitar-redefinicao
- ✅ **Solicitação para usuário válido**: Verifica envio de código de redefinição
- ❌ **Rejeição para usuário inexistente**: Testa validação de usuário
- ❌ **Requisição sem username**: Valida campos obrigatórios

#### POST /validar-codigo
- ✅ **Validação de código correto**: Testa validação bem-sucedida
- ❌ **Rejeição de código incorreto**: Verifica invalidação de códigos errados
- ❌ **Rejeição de código para usuário sem solicitação**: Testa fluxo correto
- ❌ **Rejeição de código já utilizado**: Verifica uso único de códigos

#### POST /redefinir-senha
- ✅ **Redefinição com código válido**: Testa redefinição bem-sucedida
- ❌ **Rejeição com código inválido**: Verifica validação de códigos
- ❌ **Rejeição para usuário inexistente**: Testa validação de usuário
- ❌ **Rejeição sem código validado**: Verifica fluxo correto de validação

#### POST /esqueci-senha (endpoint legado)
- ✅ **Compatibilidade com endpoint novo**: Testa retrocompatibilidade
- ❌ **Rejeição para usuário inexistente**: Verifica comportamento consistente

#### 🔍 Testes de Regressão - Fluxo Completo
- 🔄 **Login após redefinição de senha**: Testa fluxo completo de redefinição
- 🔄 **Desbloqueio após redefinição de senha**: Verifica que redefinição desbloqueia usuário

## 🛠️ Tecnologias Utilizadas

- **Mocha**: Framework de testes
- **Chai**: Biblioteca de asserções
- **Supertest**: Biblioteca para testes de API HTTP
- **Node.js**: Runtime JavaScript

## 📊 Cobertura de Testes

Os testes cobrem:

- ✅ **Funcionalidades principais**: Login, redefinição de senha, validação de código
- ✅ **Cenários de erro**: Usuários inexistentes, credenciais inválidas, códigos expirados
- ✅ **Regressão**: Fluxos completos e compatibilidade com versões anteriores
- ✅ **Fluxos complexos**: Testes de cenários que envolvem múltiplos endpoints
- ✅ **Estados de usuário**: Bloqueio, desbloqueio, validação de códigos

## 🔧 Configuração

### Dependências
```json
{
  "devDependencies": {
    "mocha": "^10.0.0",
    "chai": "^4.3.0",
    "supertest": "^6.3.0"
  }
}
```

### Scripts
```json
{
  "scripts": {
    "test": "mocha test/**/*.test.js --timeout 10000"
  }
}
```

## 📝 Notas Importantes

1. **Dados de Teste**: Os testes utilizam dados mockados em memória
2. **Limpeza**: Função `cleanupTestData()` é chamada após cada suite de testes
3. **Timeout**: Configurado para 10 segundos para acomodar operações assíncronas
4. **Isolamento**: Cada teste é independente e não depende de estado anterior
5. **Fluxos Complexos**: Testes de regressão verificam cenários que envolvem múltiplos endpoints
6. **Estados de Usuário**: Testes verificam bloqueio, desbloqueio e validação de códigos

## 🎯 Melhorias Implementadas

### Testes de Regressão
- **Fluxo completo de redefinição**: Testa todo o processo desde solicitação até login com nova senha
- **Desbloqueio automático**: Verifica que redefinição de senha desbloqueia usuários
- **Compatibilidade**: Testa endpoint legado `/esqueci-senha`

### Validações Aprimoradas
- **Campos obrigatórios**: Testes específicos para validação de dados
- **Estados de código**: Verificação de códigos únicos e não reutilizáveis
- **Fluxo correto**: Validação de que códigos devem ser validados antes da redefinição

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
npm install
```

### Erro: "ECONNREFUSED"
Certifique-se de que a API está rodando:
```bash
npm start
```

### Erro: "Timeout"
Aumente o timeout no `mocha.opts` ou no comando:
```bash
npx mocha --timeout 15000
```

### Erro: "Test failed"
- Verifique se a API está respondendo corretamente
- Confirme se os dados de teste estão corretos
- Verifique logs da API para identificar problemas 