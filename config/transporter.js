require('dotenv').config();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const activateEmail = async (dataUser) => {
  const {name, useremail, emailToken} = dataUser;
  const verifyUrl = `${process.env.URL_VERIFICATION}?token=${emailToken}`;
  const sanitizedName = name.replace(/</g, '&lt;').replace(/>/g, '&gt;');


    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: useremail,
      subject: 'Confirmação de criação de conta - Põe na Conta',
      html: `
        <h3>Olá, ${sanitizedName}!</h3>
        <p>Obrigado por se cadastrar na <strong>Põe na Conta</strong>.</p>
        <p>Para ativar sua conta, por favor confirme seu e-mail clicando no botão abaixo:</p>
        <p><a href="${verifyUrl}" style="background-color: #163465; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Confirmar e-mail</a></p>
        <p><em>Este link é válido por 20 minutos.</em></p>
        <hr>
        <p style="font-size: 12px; color: gray;">Este é um e-mail automático, por favor não responda.</p>
      `,
    });
}


  

module.exports = {transporter, activateEmail};
