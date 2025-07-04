const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Poe na Conta API",
      version: "1.0.0",
      description:
        "API do backend do projeto Poe na Conta - Uma plataforma para gerenciamento financeiro pessoal",
      contact: {
        name: "PoeNaConta Team",
        url: "https://github.com/PoeNaConta",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Servidor de desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            id: {
              type: "integer",
              description: "ID único do usuário",
            },
            name: {
              type: "string",
              description: "Nome do usuário",
              example: "João Silva",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email do usuário",
              example: "joao@email.com",
            },
            password: {
              type: "string",
              description: "Senha do usuário",
              example: "minhasenha123",
            },
            isVerified: {
              type: "boolean",
              description: "Status de verificação do email",
              default: false,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Data de criação do usuário",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Data da última atualização",
            },
          },
        },
        Transaction: {
          type: "object",
          required: ["description", "value", "type", "categoryId"],
          properties: {
            id: {
              type: "integer",
              description: "ID único da transação",
            },
            description: {
              type: "string",
              description: "Descrição da transação",
              example: "Compra no supermercado",
            },
            value: {
              type: "number",
              format: "decimal",
              description: "Valor da transação",
              example: 150.5,
            },
            type: {
              type: "string",
              enum: ["entrada", "saida", "divida", "ganho"],
              description: "Tipo da transação",
              example: "saida",
            },
            categoryId: {
              type: "integer",
              description: "ID da categoria associada",
              example: 1,
            },
            userId: {
              type: "integer",
              description: "ID do usuário proprietário",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Data de criação da transação",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Data da última atualização",
            },
          },
        },
        Category: {
          type: "object",
          required: ["name", "type"],
          properties: {
            id: {
              type: "integer",
              description: "ID único da categoria",
            },
            name: {
              type: "string",
              description: "Nome da categoria",
              example: "Alimentação",
            },
            type: {
              type: "string",
              enum: ["entrada", "saida", "divida", "ganho"],
              description: "Tipo da categoria",
              example: "saida",
            },
            userId: {
              type: "integer",
              description: "ID do usuário proprietário",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Data de criação da categoria",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Data da última atualização",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Mensagem de erro",
            },
            message: {
              type: "string",
              description: "Detalhes do erro",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["useremail", "passwordhash"],
          properties: {
            useremail: {
              type: "string",
              format: "email",
              example: "joao@email.com",
            },
            passwordhash: {
              type: "string",
              example: "minhasenha123",
            },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            token: {
              type: "string",
              description: "Token JWT para autenticação",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },
        BalanceResponse: {
          type: "object",
          properties: {
            total: {
              type: "number",
              format: "decimal",
              description: "Valor total do saldo",
            },
            gains: {
              type: "number",
              format: "decimal",
              description: "Total de ganhos",
            },
            debts: {
              type: "number",
              format: "decimal",
              description: "Total de dívidas",
            },
            categories: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  categoryName: {
                    type: "string",
                  },
                  total: {
                    type: "number",
                    format: "decimal",
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // Caminho para os arquivos que contêm as anotações do Swagger
};

const specs = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  specs,
};
