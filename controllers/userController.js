const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { transporter, activateEmail } = require('../config/transporter');
require('dotenv').config();
// const secret = process.env.JWT_SECRET;

exports.searchUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno ao buscar usuário' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, useremail, passwordhash } = req.body;

    if (!name || !useremail || !passwordhash) {
      return res.status(400).json({
        error: 'Nome, email e senha são obrigatórios.',
      });
    }

    const existingUser = await User.findOne({ where: { useremail } });
    if (existingUser) {
      return res.status(409).json({ error: 'E-mail já cadastrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordhash, salt);

    const newUser = await User.create({
      name,
      useremail,
      passwordhash: hashedPassword,
      emailverified: false,
    });

    const emailToken = jwt.sign(
      { id: newUser.id },
      process.env.JWT_EMAIL_SECRET,
      { expiresIn: '20m' },
    );

    await activateEmail({
      name: newUser.name,
      useremail: newUser.useremail,
      emailToken,
    });

    return res.status(201).json({
      message:
        'Usuário criado com sucesso. Verifique seu email para ativar sua conta.',
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro interno ao criar usuário.' });
  }
};

exports.verifyEmailToken = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res
      .status(400)
      .json({ error: 'Token de verificação não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (user.emailverified) {
      return res
        .status(409)
        .json({ message: 'E-mail já foi verificado anteriormente.' });
    }

    user.emailverified = true;
    await user.save();

    return res.status(200).json({ message: 'E-mail verificado com sucesso!' });
  } catch (error) {
    console.error('Erro na verificação de e-mail:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(410).json({
        error: 'Token expirado. Solicite um novo e-mail de verificação.',
      });
    }

    return res.status(400).json({ error: 'Token inválido.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    await user.destroy();

    res.status(204).end();
  } catch (error) {
    console.error('Erro ao remover usuário:', error);
    res.status(500).json({ error: 'Erro interno ao remover usuário' });
  }
};

exports.login = async (req, res) => {
  const { useremail, passwordhash } = req.body;

  if (!useremail || !passwordhash) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    const user = await User.findOne({ where: { useremail } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (!user.emailverified) {
      return res.status(403).json({
        error: 'E-mail não verificado. Verifique sua caixa de entrada.',
      });
    }

    const isPasswordValid = await bcrypt.compare(
      passwordhash,
      user.passwordhash,
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Criar o Token JWT
    const token = jwt.sign(
      { id: user.id, useremail: user.useremail },
      process.env.JWT_SECRET,
      { expiresIn: '2h' },
    );

    res.status(200).json({
      message: 'Login realizado com sucesso',
      token,
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

// Update
exports.updateName = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Nome não fornecido.' });
  }

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    user.name = name;
    await user.save();

    return res.status(200).json({ message: 'Nome atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar nome:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.requestEmailUpdate = async (req, res) => {
  const { newEmail } = req.body;

  if (!newEmail) {
    return res.status(400).json({ error: 'Novo e-mail não fornecido.' });
  }

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    const existingUser = await User.findOne({
      where: { useremail: newEmail },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ error: 'Este e-mail já está em uso por outro usuário.' });
    }

    if (newEmail === user.useremail) {
      return res
        .status(400)
        .json({ error: 'O novo e-mail é igual ao e-mail atual.' });
    }

    const token = jwt.sign(
      { id: user.id, newEmail },
      process.env.JWT_EMAIL_SECRET,
      { expiresIn: '20m' },
    );

    const verifyUrl = `${process.env.URL_NEW_EMAIL}?token=${token}`;

    const sanitizedName = user.name.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: newEmail,
      subject: 'Confirmação de e-mail - Põe na Conta',
      html: `
        <h3>Olá, ${sanitizedName}!</h3>
        <p>Você solicitou uma alteração de email na <strong>Põe na Conta</strong>.</p>
        <p>Para ativar sua conta, por favor confirme seu e-mail clicando no botão abaixo:</p>
        <p><a href="${verifyUrl}" style="background-color: #163465; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Confirmar e-mail</a></p>
        <p><em>Este link é válido por 20 minutos.</em></p>
        <hr>
        <p style="font-size: 12px; color: gray;">Este é um e-mail automático, por favor não responda.</p>
      `,
    });

    return res.status(200).json({
      message: 'E-mail de verificação enviado. Verifique sua caixa de entrada.',
    });
  } catch (error) {
    console.error('Erro ao solicitar atualização de e-mail:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res
      .status(400)
      .json({ error: 'Token de verificação não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (user.useremail === decoded.newEmail) {
      return res
        .status(409)
        .json({ message: 'Este e-mail já está verificado.' });
    }

    user.useremail = decoded.newEmail;

    await user.save();

    return res
      .status(200)
      .json({ message: 'E-mail verificado e atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro na verificação de e-mail:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(410).json({
        error: 'Token expirado. Solicite novamente a alteração de e-mail.',
      });
    }

    return res.status(400).json({ error: 'Token inválido.' });
  }
};

exports.updPass = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'Corpo da requisição ausente.' });
    }

    const { oldPass, newPass } = req.body;
    const user = await User.findByPk(req.user.id);
    const passHash = await bcrypt.compare(oldPass, user.passwordhash);

    if (!newPass || !oldPass) {
      return res
        .status(400)
        .json({ message: 'Os campos de senha devem ser preenchidos.' });
    }

    if (!passHash) {
      return res
        .status(400)
        .json({ message: 'A senha informada está incorreta.' });
    }

    if (oldPass == newPass) {
      return res
        .status(400)
        .json({ message: 'A nova senha não pode ser igual a anterior.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(newPass, salt);

    user.passwordhash = hashedPass;
    await user.save();

    return res.status(200).json({ message: 'Senha atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar a senha:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// Recuperação de senha
exports.forgotPass = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { useremail: email } });

    if (!user) {
      // Para não revelar se o e-mail existe ou não
      return res
        .status(200)
        .json({ message: 'Se o e-mail existir, enviaremos instruções.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '10min',
    });

    const resetLink = `${process.env.URL_RESET_PASS}?token=${token}`;

    await transporter.sendMail({
      to: user.useremail,
      subject: 'Recuperação de senha',
      html: `<p>Olá! Clique <a href="${resetLink}">aqui</a> para redefinir sua senha.</p>`,
    });

    return res
      .status(200)
      .json({ message: 'Se o e-mail existir, enviaremos instruções.' });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return res
      .status(500)
      .json({ message: 'Erro ao enviar e-mail de recuperação.' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.query;
  const { newPass } = req.body;

  if (!token) {
    return res
      .status(400)
      .json({ error: 'Token de verificação não fornecido.' });
  }

  if (!newPass) {
    return res.status(400).json({ message: 'Nova senha é obrigatória.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPass, salt);

    user.passwordhash = hashed;
    await user.save();

    return res.status(200).json({ message: 'Senha redefinida com sucesso.' });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return res.status(500).json({ message: 'Token inválido ou expirado.' });
  }
};
