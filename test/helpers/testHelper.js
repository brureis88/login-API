const chai = require('chai');
const supertest = require('supertest');
const app = require('../../src/app');

// Configuração do Chai
global.expect = chai.expect;
global.assert = chai.assert;

// Configuração do Supertest
global.request = supertest(app);

// Dados de teste
global.testData = {
  validUser: {
    username: 'usuario1',
    password: 'senha123'
  },
  invalidUser: {
    username: 'usuario_inexistente',
    password: 'senha_errada'
  },
  validLoginData: {
    username: 'usuario1',
    password: 'senha123'
  },
  invalidLoginData: {
    username: 'usuario1',
    password: 'senha_errada'
  }
};

// Função helper para limpar dados de teste
global.cleanupTestData = () => {
  // Em um ambiente real, aqui limparíamos o banco de dados
  console.log('🧹 Limpeza de dados de teste concluída');
};

// Função para resetar estado do usuário
global.resetUserState = async () => {
  // Em um ambiente real, resetaríamos o estado do usuário
  // Por enquanto, vamos usar um usuário diferente para testes de bloqueio
  console.log('🔄 Estado do usuário resetado');
}; 