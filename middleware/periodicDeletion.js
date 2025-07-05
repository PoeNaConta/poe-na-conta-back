const cron = require('node-cron');
const { Op } = require('sequelize');
const User = require('../models/User');

// Roda a cada 5 minutos
cron.schedule('*/5 * * * *', async () => {
  console.log('Rodando cron job...');

  try {
    const deleted = await User.destroy({
      where: {
        emailverified: false,
        createdat: {
          [Op.lt]: new Date(Date.now() - 21 * 60 * 1000), // 21 minutos atrás
        },
      },
    });

    if (deleted > 0) {
      console.log(`${deleted} usuários não verificados removidos`);
    } else {
      console.log('Nenhum usuário removido');
    }
  } catch (err) {
    console.error('Erro ao deletar usuários não verificados:', err);
  }
});
