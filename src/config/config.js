const path = require('path');

module.exports = {
  development: {
    // Define o dialeto para sqlite
    dialect: 'sqlite',
    // Define o caminho físico onde o arquivo do banco de dados será criado e salvo
    storage: path.resolve(__dirname, '..', 'database.sqlite'),
    logging: false, // Mude para console.log se quiser ver o SQL gerado no terminal
  },
  // Deixamos os ambientes de teste e produção prontos caso decida usar servidores reais depois
  test: {
    dialect: 'sqlite',
    storage: ':memory:', // Roda em memória para testes rápidos
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql', // Se no futuro subir para nuvem usando MySQL
    logging: false
  }
};