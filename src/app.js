const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

// Configuração Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Login',
      version: '1.0.0',
      description: 'API Rest simples de Login para estudos de teste de software',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/', authRoutes);

module.exports = app; 