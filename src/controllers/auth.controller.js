'use strict';
const AuthService = require('../services/auth.service');

const register = async (req, res) => {
    try {
        // Como o middleware já validou, aqui o req.body está garantido
        const usuario = await AuthService.createUser(req.body);
        
        return res.status(201).json({ 
            success: true, 
            message: "Usuário criado com sucesso!", 
            data: usuario 
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ success: false, message: "E-mail ou CPF já cadastrados." });
        }
        return res.status(500).json({ success: false, message: "Erro interno no servidor." });
    }
};

const login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const result = await AuthService.loginUser(email, senha);
        
        return res.status(200).json({ 
            success: true, 
            message: "Login realizado com sucesso!", 
            data: result 
        });
    } catch (error) {
        // Retorna 401 para credenciais inválidas
        if (error.message === "Credenciais inválidas.") {
            return res.status(401).json({ success: false, message: error.message });
        }
        return res.status(500).json({ success: false, message: "Erro interno no servidor." });
    }
};

module.exports = { register, login };