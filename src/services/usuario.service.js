'use strict';

const { Usuario } = require('../models');
const { validarQualidadeSenha } = require('./password.service');

const criarErro = (message, statusCode = 400) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const mascararTexto = (valor, visiveisInicio = 2, visiveisFim = 2) => {
    if (!valor) {
        return valor;
    }

    const texto = String(valor);

    if (texto.length <= visiveisInicio + visiveisFim) {
        return '*'.repeat(texto.length);
    }

    return `${texto.slice(0, visiveisInicio)}${'*'.repeat(texto.length - visiveisInicio - visiveisFim)}${texto.slice(-visiveisFim)}`;
};

const formatarUsuario = (usuario, { mascararDadosSensiveis = true } = {}) => {
    return {
        id: usuario.id,
        nome: usuario.nome,
        sobrenome: usuario.sobrenome,
        email: usuario.email,
        telefone: mascararDadosSensiveis ? mascararTexto(usuario.telefone, 2, 2) : usuario.telefone,
        endereco: mascararDadosSensiveis ? mascararTexto(usuario.endereco, 4, 4) : usuario.endereco,
        cpf: mascararDadosSensiveis ? mascararTexto(usuario.cpf, 3, 2) : usuario.cpf
    };
};

const selecionarCampos = (dados, camposPermitidos) => {
    return camposPermitidos.reduce((resultado, campo) => {
        if (Object.prototype.hasOwnProperty.call(dados, campo)) {
            resultado[campo] = dados[campo];
        }

        return resultado;
    }, {});
};

const buscarUsuarioOuFalhar = async (id) => {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
        throw criarErro("Usuário não encontrado.", 404);
    }

    return usuario;
};

const buscarPerfilPorToken = async (usuarioToken) => {
    if (!usuarioToken || !usuarioToken.id) {
        throw criarErro("Usuário não autenticado.", 401);
    }

    const usuario = await buscarUsuarioOuFalhar(usuarioToken.id);

    return formatarUsuario(usuario);
};

const buscarUsuarioPorId = async (id) => {
    const usuario = await buscarUsuarioOuFalhar(id);

    return formatarUsuario(usuario);
};

const editarPerfilPorToken = async (usuarioToken, dados) => {
    if (!usuarioToken || !usuarioToken.id) {
        throw criarErro("Usuário não autenticado.", 401);
    }

    const dadosPermitidos = selecionarCampos(dados, ['nome', 'sobrenome', 'senha', 'cpf', 'telefone', 'endereco']);

    if (dadosPermitidos.senha) {
        validarQualidadeSenha(dadosPermitidos.senha);
    }

    const usuario = await buscarUsuarioOuFalhar(usuarioToken.id);
    await usuario.update(dadosPermitidos);

    return formatarUsuario(usuario);
};

const editarUsuarioPorId = async (id, dados) => {
    const dadosPermitidos = selecionarCampos(dados, ['nome', 'sobrenome', 'cpf', 'telefone', 'endereco']);
    const usuario = await buscarUsuarioOuFalhar(id);
    await usuario.update(dadosPermitidos);

    return formatarUsuario(usuario);
};

module.exports = {
    buscarPerfilPorToken,
    buscarUsuarioPorId,
    editarPerfilPorToken,
    editarUsuarioPorId
};
