'use strict';

// 1. Importação dos arquivos de rotas específicos
const authRoutes = require('./auth.routes');
const ticketsRoutes = require('./tickets.routes'); 
const produtosRoutes = require('./produtos.routes');
const categoriasRoutes = require('./categorias.routes');
const usuarioRoutes = require('./usuario.routes');
const compraRoutes = require('./compra.routes');

// 2. Exportamos uma função que recebe o 'app' do arquivo principal
module.exports = (app) => {
    
    // Rota global de teste da API dentro do hub
    app.get('/api', (req, res) => {
        res.status(200).json({ 
            success: true, 
            message: "API E-comercio rodando perfeitamente e conectada ao SQLite." 
        });
    });

    // 3. Vinculação das rotas aos seus respectivos prefixos usando o 'app'
    app.use('/api/auth', authRoutes);
    app.use('/api/tickets', ticketsRoutes);
    app.use('/api/products', produtosRoutes);
    app.use('/api/categories', categoriasRoutes);
    app.use('/api/users', usuarioRoutes);
    app.use('/api/orders', compraRoutes);
};
