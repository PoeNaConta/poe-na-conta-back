const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secret);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Usuário inválido' });
    }

    req.user = {
      id: user.id,
      useremail: user.useremail,
    };

    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

module.exports = authenticate;
