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

exports.esqueciSenha = (req, res) => {
  const { username } = req.body;
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
  }

  user.tentativas = 0;
  user.bloqueado = false;
  return res.status(200).json({ mensagem: 'Instruções para redefinição de senha enviadas para o e-mail cadastrado.' });
}; 