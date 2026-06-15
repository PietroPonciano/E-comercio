require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { sequelize } = require('./src/models');
const routes = require('./src/routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api', routes);

// Rota de teste
app.get('/', (req, res) => {
    res.json({
        message: 'API funcionando!'
    });
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

async function startServer() {
    try {
        // Testa conexão com o banco
        await sequelize.authenticate();
        console.log('Banco conectado com sucesso!');

        // Sincroniza models (opcional)
        // await sequelize.sync();

        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://${HOST}:${PORT}`);
        });

    } catch (error) {
        console.error('Erro ao conectar ao banco:', error);
        process.exit(1);
    }
}

startServer();