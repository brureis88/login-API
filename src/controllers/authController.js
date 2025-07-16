// Usuários em memória
const users = [
  {
    id: 1,
    username: 'usuario1',
    password: 'senha123',
    tentativas: 0,
    bloqueado: false,
  },
];

// Códigos de redefinição mockados (em produção seria um banco de dados)
const codigosRedefinicao = new Map();

// Gerar código aleatório de 6 dígitos
const gerarCodigo = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Simular envio de email (mockado)
const enviarEmailMock = (email, codigo) => {
  console.log(`📧 Email enviado para ${email}:`);
  console.log(`🔑 Seu código de redefinição é: ${codigo}`);
  console.log(`⏰ Este código expira em 10 minutos`);
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ mensagem: 'Usuário ou senha inválidos.' });
  }

  if (user.bloqueado) {
    return res.status(423).json({ mensagem: 'Usuário bloqueado por tentativas inválidas.' });
  }

  if (user.password === password) {
    user.tentativas = 0;
    return res.status(200).json({ mensagem: 'Login realizado com sucesso!' });
  } else {
    user.tentativas += 1;
    if (user.tentativas >= 3) {
      user.bloqueado = true;
      return res.status(423).json({ mensagem: 'Usuário bloqueado por tentativas inválidas.' });
    }
    return res.status(401).json({ mensagem: 'Usuário ou senha inválidos.' });
  }
};

exports.solicitarRedefinicao = (req, res) => {
  const { username } = req.body;
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
  }

  // Gerar código único
  const codigo = gerarCodigo();
  const email = `${username}@exemplo.com`; // Email mockado
  
  // Armazenar código com timestamp (expira em 10 minutos)
  codigosRedefinicao.set(username, {
    codigo,
    timestamp: Date.now(),
    usado: false
  });

  // Simular envio de email
  enviarEmailMock(email, codigo);

  return res.status(200).json({ 
    mensagem: 'Código de redefinição enviado para o e-mail cadastrado.',
    email: email, // Apenas para demonstração
    codigo: codigo // Apenas para demonstração (em produção não seria retornado)
  });
};

exports.validarCodigo = (req, res) => {
  const { username, codigo } = req.body;
  
  const dadosCodigo = codigosRedefinicao.get(username);
  
  if (!dadosCodigo) {
    return res.status(400).json({ mensagem: 'Nenhum código de redefinição solicitado para este usuário.' });
  }

  if (dadosCodigo.usado) {
    return res.status(400).json({ mensagem: 'Este código já foi utilizado.' });
  }

  // Verificar se o código expirou (10 minutos)
  const agora = Date.now();
  const tempoExpiracao = 10 * 60 * 1000; // 10 minutos em millisegundos
  
  if (agora - dadosCodigo.timestamp > tempoExpiracao) {
    codigosRedefinicao.delete(username);
    return res.status(400).json({ mensagem: 'Código expirado. Solicite um novo código.' });
  }

  if (dadosCodigo.codigo !== codigo) {
    return res.status(400).json({ mensagem: 'Código inválido.' });
  }

  // Marcar código como usado
  dadosCodigo.usado = true;
  codigosRedefinicao.set(username, dadosCodigo);

  return res.status(200).json({ mensagem: 'Código válido. Você pode redefinir sua senha.' });
};

exports.redefinirSenha = (req, res) => {
  const { username, codigo, novaSenha } = req.body;
  
  const dadosCodigo = codigosRedefinicao.get(username);
  
  if (!dadosCodigo || !dadosCodigo.usado) {
    return res.status(400).json({ mensagem: 'Código inválido ou não validado.' });
  }

  if (dadosCodigo.codigo !== codigo) {
    return res.status(400).json({ mensagem: 'Código inválido.' });
  }

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
  }

  // Redefinir senha e desbloquear usuário
  user.password = novaSenha;
  user.tentativas = 0;
  user.bloqueado = false;

  // Remover código usado
  codigosRedefinicao.delete(username);

  return res.status(200).json({ mensagem: 'Senha redefinida com sucesso!' });
};

// Manter compatibilidade com o endpoint antigo
exports.esqueciSenha = (req, res) => {
  // Redirecionar para o novo fluxo de redefinição
  return exports.solicitarRedefinicao(req, res);
}; 