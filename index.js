require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { sequelize } = require('./src/models');
const registrarRotas = require('./src/routes');

const app = express();

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET não configurado.");
  process.exit(1);
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

registrarRotas(app);

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
        await sequelize.authenticate();
        console.log('Banco conectado com sucesso!');

        
        app.listen(PORT, HOST, () => {
            
            const displayHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
            console.log(`Servidor rodando em http://${displayHost}:${PORT}`);
            if (HOST === '0.0.0.0') {
                console.log(`Acessível na rede local pelo IP do seu Mac na porta ${PORT}`);
            }
        });

    } catch (error) {
        console.error('Erro ao conectar ao banco:', error);
        process.exit(1);
    }
}

startServer();