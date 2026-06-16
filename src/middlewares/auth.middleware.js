'use strict';
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    // 1. Pega o token do cabeçalho 'Authorization'
    const authHeader = req.headers['authorization'];
    
    // O formato padrão do cabeçalho é: "Bearer <TOKEN>"
    // O split(' ') separa a palavra 'Bearer' do token real
    const token = authHeader && authHeader.split(' ')[1];

    // Se o token não for enviado
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "Acesso negado. Token não fornecido." 
        });
    }

    try {
        // 2. Verifica se o token é válido usando a sua chave secreta
        const verificado = jwt.verify(token, process.env.JWT_SECRET || 'chave_segurança_padrao_local');
        
        // 3. Injeta os dados do usuário dentro da requisição (req.usuario)
        // Assim, qualquer controller da rota protegida saberá QUEM está logado (id e role_id)
        req.usuario = verificado;
        
        // Tudo certo! Segue para o próximo passo (Controller ou próximo Middleware)
        next();
    } catch (error) {
        // Se o token estiver expirado, corrompido ou for falso
        return res.status(403).json({ 
            success: false, 
            message: "Token inválido ou expirado." 
        });
    }
};

module.exports = verificarToken;