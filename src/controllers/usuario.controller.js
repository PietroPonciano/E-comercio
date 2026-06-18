'use strict';

const UsuarioService = require('../services/usuario.service');

const respostaErro = (res, error) => {
    if (error.statusCode) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            success: false,
            message: "CPF já cadastrado."
        });
    }

    if (error.message.startsWith("Senha fraca") || error.message === "A senha é obrigatória.") {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    return res.status(500).json({
        success: false,
        message: "Erro interno no servidor."
    });
};

const getProfile = async (req, res) => {
    try {
        const usuario = await UsuarioService.buscarPerfilPorToken(req.usuario);

        return res.status(200).json({
            success: true,
            data: usuario
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

const updateProfile = async (req, res) => {
    try {
        const usuario = await UsuarioService.editarPerfilPorToken(req.usuario, req.body);

        return res.status(200).json({
            success: true,
            message: "Perfil atualizado com sucesso.",
            data: usuario
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

const getUserById = async (req, res) => {
    try {
        const usuario = await UsuarioService.buscarUsuarioPorId(req.params.id);

        return res.status(200).json({
            success: true,
            data: usuario
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

const updateUserById = async (req, res) => {
    try {
        const usuario = await UsuarioService.editarUsuarioPorId(req.params.id, req.body);

        return res.status(200).json({
            success: true,
            message: "Usuário atualizado com sucesso.",
            data: usuario
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

module.exports = { getProfile, updateProfile, getUserById, updateUserById };
