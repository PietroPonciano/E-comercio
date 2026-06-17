'use strict';
const AuthService = require('../services/auth.service');

const respostaErro = (res, error) => {
    if (error.statusCode) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            ...(error.data || {})
        });
    }

    return res.status(500).json({ success: false, message: "Erro interno no servidor." });
};

const register = async (req, res) => {
    try {
        // Como o middleware já validou, aqui o req.body está garantido
        const usuario = await AuthService.createUser(req.body);
        
        return res.status(201).json({ 
            success: true, 
            message: "Usuário criado com sucesso. Enviamos um código para verificar seu e-mail.", 
            data: usuario 
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ success: false, message: "E-mail ou CPF já cadastrados." });
        }
        if (error.message.startsWith("Senha fraca") || error.message === "A senha é obrigatória.") {
            return res.status(400).json({ success: false, message: error.message });
        }
        return respostaErro(res, error);
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
        return respostaErro(res, error);
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { email, codigo } = req.body;
        const result = await AuthService.verificarEmail(email, codigo);

        return res.status(200).json({
            success: true,
            message: result.alreadyVerified ? "E-mail já verificado." : "E-mail verificado com sucesso."
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

const resendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await AuthService.reenviarCodigoVerificacaoEmail(email);

        return res.status(200).json({
            success: true,
            message: result.alreadyVerified
                ? "E-mail já verificado."
                : "Código de verificação reenviado para o e-mail cadastrado."
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        await AuthService.solicitarResetSenha(email);

        return res.status(200).json({
            success: true,
            message: "Código de recuperação enviado para o e-mail cadastrado."
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, codigo, novaSenha } = req.body;
        await AuthService.resetarSenha(email, codigo, novaSenha);

        return res.status(200).json({
            success: true,
            message: "Senha redefinida com sucesso."
        });
    } catch (error) {
        if (error.message === "Código inválido ou expirado.") {
            return res.status(400).json({ success: false, message: error.message });
        }
        if (error.message.startsWith("Senha fraca") || error.message === "A senha é obrigatória.") {
            return res.status(400).json({ success: false, message: error.message });
        }

        return respostaErro(res, error);
    }
};

module.exports = { register, login, verifyEmail, resendVerificationCode, forgotPassword, resetPassword };
