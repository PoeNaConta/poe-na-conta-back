const express = require('express');
const app = express();

// Configuração do Swagger
const { swaggerUi, specs } = require('./swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Middleware para JSON
app.use(express.json());

// Rota de teste simples
app.get('/api/test', (req, res) => {
  res.json({ message: 'Swagger funcionando!' });
});

const PORT = 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor de teste rodando na porta ${PORT}`);
  console.log(
    `Documentação Swagger disponível em: http://localhost:${PORT}/api-docs`,
  );
});
