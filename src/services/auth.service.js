'use strict';
const { Usuario } = require('../models');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const createUser = async (data) => {

    // Criação no banco (A senha vai limpa por aqui, o Hook do Model cuida do Hash)
    const novoUsuario = await Usuario.create({
        ...data,
        role_id: 3 // Força usuário comum
    });

    const usuarioJson = novoUsuario.toJSON();
    delete usuarioJson.senha; // Segurança: remove o hash do retorno

    return usuarioJson;
};

// O seu loginUser continua EXATAMENTE igual abaixo
const loginUser = async (email, senha) => {
    const usuario = await Usuario.findOne({ where: { email } });
    
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
        throw new Error("Credenciais inválidas.");
    }

    const token = jwt.sign(
        { id: usuario.id, role_id: usuario.role_id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );

    return { token, usuarioId: usuario.id };
};

module.exports = { createUser, loginUser };