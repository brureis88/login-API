require('../helpers/testHelper');

describe('🔐 Testes de Integração - API de Autenticação', () => {

  describe('POST /login', () => {

    it('✅ Deve fazer login com credenciais válidas', async () => {
      const response = await request
        .post('/login')
        .send(testData.validLoginData)
        .expect(200);

      expect(response.body).to.have.property('mensagem');
      expect(response.body.mensagem).to.equal('Login realizado com sucesso!');
    });

    it('❌ Deve rejeitar login com usuário inexistente', async () => {
      const response = await request
        .post('/login')
        .send({
          username: 'usuario_inexistente',
          password: 'senha123'
        })
        .expect(401);

      expect(response.body).to.have.property('mensagem');
      expect(response.body.mensagem).to.equal('Usuário ou senha inválidos.');
    });

    it('❌ Deve rejeitar login com senha incorreta', async () => {
      const response = await request
        .post('/login')
        .send(testData.invalidLoginData)
        .expect(401);

      expect(response.body).to.have.property('mensagem');
      expect(response.body.mensagem).to.equal('Usuário ou senha inválidos.');
    });

    it('❌ Deve rejeitar requisição com campos obrigatórios ausentes', async () => {
      //Login com sucesso
      await request
        .post('/login')
        .send(testData.validLoginData)
        .expect(200);

      //Login com campos obrigatórios ausentes
      const response = await request
        .post('/login')
        .send({ username: 'usuario1' })
        .expect(401);

      expect(response.body).to.have.property('mensagem');
      expect(response.body.mensagem).to.equal('Usuário ou senha inválidos.');
    });

    it('🚫 Deve bloquear usuário após 3 tentativas inválidas', async () => {
      //Login com sucesso
      await request
        .post('/login')
        .send(testData.validLoginData)
        .expect(200);

      // Primeira tentativa inválida
      await request
        .post('/login')
        .send(testData.invalidLoginData)
        .expect(401);

      // Segunda tentativa inválida
      await request
        .post('/login')
        .send(testData.invalidLoginData)
        .expect(401);

      // Terceira tentativa inválida - deve bloquear
      const response = await request
        .post('/login')
        .send(testData.invalidLoginData)
        .expect(423);

      expect(response.body).to.have.property('mensagem');
      expect(response.body.mensagem).to.equal('Usuário bloqueado por tentativas inválidas.');
    });

    it('🚫 Deve rejeitar login de usuário bloqueado', async () => {
      const response = await request
        .post('/login')
        .send(testData.validLoginData)
        .expect(423);

      expect(response.body).to.have.property('mensagem');
      expect(response.body.mensagem).to.equal('Usuário bloqueado por tentativas inválidas.');
    });
  });

  describe('POST /solicitar-redefinicao', () => {

    it('✅ Deve solicitar redefinição para usuário válido', async () => {
      const response = await request
        .post('/solicitar-redefinicao')
        .send({ username: 'usuario1' })
        .expect(200);

      expect(response.body).to.have.property('mensagem');
      expect(response.body).to.have.property('email');
      expect(response.body).to.have.property('codigo');
      expect(response.body.mensagem).to.equal('Código de redefinição enviado para o e-mail cadastrado.');
    });

    it('❌ Deve rejeitar solicitação para usuário inexistente', async () => {
      const response = await request
        .post('/solicitar-redefinicao')
        .send({ username: 'usuario_inexistente' })
        .expect(404);

      expect(response.body).to.have.property('mensagem');
      expect(response.body.mensagem).to.equal('Usuário não encontrado.');
    });

    it('❌ Deve rejeitar requisição sem username', async () => {
      const response = await request
        .post('/solicitar-redefinicao')
        .send({})
        .expect(404);

      expect(response.body).to.have.property('mensagem');
    });
  });

  describe('POST /validar-codigo', () => {
    let codigoValido;

    before(async () => {
      // Solicitar código para usar nos testes
      const response = await request
        .post('/solicitar-redefinicao')
        .send({ username: 'usuario1' });

      codigoValido = response.body.codigo;
    });

    it('✅ Deve validar código correto', async () => {
      const response = await request
        .post('/validar-codigo')
        .send({
          username: 'usuario1',
          codigo: codigoValido
        })
        .expect(200);

      expect(response.body).to.have.property('mensagem');
      expect(response.body.mensagem).to.equal('Código válido. Você pode redefinir sua senha.');
    });

    it('❌ Deve rejeitar código incorreto', async () => {
      const response = await request
        .post('/validar-codigo')
        .send({
          username: 'usuario1',
          codigo: '000000'
        })
        .expect(400);

      expect(response.body).to.have.property('mensagem');
      expect(response.body.mensagem).to.equal('Este código já foi utilizado.');
    });

    it('❌ Deve rejeitar código para usuário sem solicitação', async () => {
      const response = await request
        .post('/validar-codigo')
        .send({
          username: 'usuario_inexistente',
          codigo: '123456'
        })
        .expect(400);

      expect(response.body).to.have.property('mensagem');
      expect(response.body.mensagem).to.equal('Nenhum código de redefinição solicitado para este usuário.');
    });

    it('❌ Deve rejeitar código já utilizado', async () => {
      // Tentar usar o mesmo código novamente
      const response = await request
        .post('/validar-codigo')
        .send({
          username: 'usuario1',
          codigo: codigoValido
        })
        .expect(400);

      expect(response.body).to.have.property('mensagem');
      expect(response.body.mensagem).to.equal('Este código já foi utilizado.');
    });
  });

  describe('POST /redefinir-senha', () => {
    let codigoValido;

    before(async () => {
      // Solicitar novo código para usar nos testes
      const response = await request
        .post('/solicitar-redefinicao')
        .send({ username: 'usuario1' });

      codigoValido = response.body.codigo;

      // Validar o código primeiro
      await request
        .post('/validar-codigo')
        .send({
          username: 'usuario1',
          codigo: codigoValido
        });
    });

    it('✅ Deve redefinir senha com código válido', async () => {
      const response = await request
        .post('/redefinir-senha')
        .send({
          username: 'usuario1',
          codigo: codigoValido,
          novaSenha: 'novaSenha123'
        })
        .expect(200);

      expect(response.body).to.have.property('mensagem');
      expect(response.body.mensagem).to.equal('Senha redefinida com sucesso!');
    });

    it('❌ Deve rejeitar redefinição com código inválido', async () => {
      const response = await request
        .post('/redefinir-senha')
        .send({
          username: 'usuario1',
          codigo: '000000',
          novaSenha: 'novaSenha123'
        })
        .expect(400);

      expect(response.body).to.have.property('mensagem');
      expect(response.body.mensagem).to.equal('Código inválido ou não validado.');
    });

    it('❌ Deve rejeitar redefinição para usuário inexistente', async () => {
      const response = await request
        .post('/redefinir-senha')
        .send({
          username: 'usuario_inexistente',
          codigo: '123456',
          novaSenha: 'novaSenha123'
        })
        .expect(400);

      expect(response.body).to.have.property('mensagem');
      expect(response.body.mensagem).to.equal('Código inválido ou não validado.');
    });

    it('❌ Deve rejeitar redefinição sem código validado', async () => {
      // Solicitar novo código sem validar
      const responseSolicitar = await request
        .post('/solicitar-redefinicao')
        .send({ username: 'usuario1' });

      const codigoNaoValidado = responseSolicitar.body.codigo;

      const response = await request
        .post('/redefinir-senha')
        .send({
          username: 'usuario1',
          codigo: codigoNaoValidado,
          novaSenha: 'novaSenha123'
        })
        .expect(400);

      expect(response.body).to.have.property('mensagem');
      expect(response.body.mensagem).to.equal('Código inválido ou não validado.');
    });
  });

  describe('POST /esqueci-senha (endpoint legado)', () => {

    it('✅ Deve funcionar como alias para solicitar-redefinicao', async () => {
      const response = await request
        .post('/esqueci-senha')
        .send({ username: 'usuario1' })
        .expect(200);

      expect(response.body).to.have.property('mensagem');
      expect(response.body).to.have.property('email');
      expect(response.body).to.have.property('codigo');
      expect(response.body.mensagem).to.equal('Código de redefinição enviado para o e-mail cadastrado.');
    });

    it('❌ Deve rejeitar usuário inexistente no endpoint legado', async () => {
      const response = await request
        .post('/esqueci-senha')
        .send({ username: 'usuario_inexistente' })
        .expect(404);

      expect(response.body).to.have.property('mensagem');
      expect(response.body.mensagem).to.equal('Usuário não encontrado.');
    });
  });

  describe('🔍 Testes de Regressão - Fluxo Completo', () => {

    it('🔄 Deve permitir login após redefinição de senha', async () => {
      // 1. Solicitar redefinição
      const responseSolicitar = await request
        .post('/solicitar-redefinicao')
        .send({ username: 'usuario1' });

      const codigo = responseSolicitar.body.codigo;

      // 2. Validar código
      await request
        .post('/validar-codigo')
        .send({
          username: 'usuario1',
          codigo: codigo
        });

      // 3. Redefinir senha
      await request
        .post('/redefinir-senha')
        .send({
          username: 'usuario1',
          codigo: codigo,
          novaSenha: 'senhaNova123'
        });

      // 4. Tentar login com nova senha
      const responseLogin = await request
        .post('/login')
        .send({
          username: 'usuario1',
          password: 'senhaNova123'
        })
        .expect(200);

      expect(responseLogin.body.mensagem).to.equal('Login realizado com sucesso!');
    });

    it('🔄 Deve desbloquear usuário após redefinição de senha', async () => {
      // 1. Bloquear usuário com tentativas inválidas
      for (let i = 0; i < 3; i++) {
        await request
          .post('/login')
          .send({
            username: 'usuario1',
            password: 'senha_errada'
          });
      }

      // 2. Verificar que está bloqueado
      await request
        .post('/login')
        .send({
          username: 'usuario1',
          password: 'senhaNova123'
        })
        .expect(423);

      // 3. Solicitar redefinição
      const responseSolicitar = await request
        .post('/solicitar-redefinicao')
        .send({ username: 'usuario1' });

      const codigo = responseSolicitar.body.codigo;

      // 4. Validar código
      await request
        .post('/validar-codigo')
        .send({
          username: 'usuario1',
          codigo: codigo
        });

      // 5. Redefinir senha (deve desbloquear)
      await request
        .post('/redefinir-senha')
        .send({
          username: 'usuario1',
          codigo: codigo,
          novaSenha: 'senhaDesbloqueada123'
        });

      // 6. Verificar que pode fazer login
      const responseLogin = await request
        .post('/login')
        .send({
          username: 'usuario1',
          password: 'senhaDesbloqueada123'
        })
        .expect(200);

      expect(responseLogin.body.mensagem).to.equal('Login realizado com sucesso!');
    });
  });

  after(() => {
    cleanupTestData();
  });
}); 