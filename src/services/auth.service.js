'use strict';
const { Usuario, sequelize } = require('../models');
const { enviarCodigoResetSenha, enviarCodigoVerificacaoEmail } = require('./email.service');
const { validarQualidadeSenha } = require('./password.service');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const CODE_TTL_MINUTES = 15;
const RESEND_COOLDOWN_SECONDS = 60;

const criarErro = (message, statusCode = 400, code = null, data = {}) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.code = code;
    error.data = data;
    return error;
};

const gerarCodigo = () => crypto.randomInt(100000, 1000000).toString();

const gerarHashCodigo = (codigo) => {
    return crypto
        .createHash('sha256')
        .update(codigo)
        .digest('hex');
};

const gerarDataExpiracao = () => new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);

const codigoExpirou = (dataExpiracao) => {
    return !dataExpiracao || new Date(dataExpiracao) < new Date();
};

const garantirPodeReenviar = (ultimoEnvio) => {
    if (!ultimoEnvio) {
        return;
    }

    const segundosDesdeUltimoEnvio = (Date.now() - new Date(ultimoEnvio).getTime()) / 1000;

    if (segundosDesdeUltimoEnvio < RESEND_COOLDOWN_SECONDS) {
        const segundosRestantes = Math.ceil(RESEND_COOLDOWN_SECONDS - segundosDesdeUltimoEnvio);
        throw criarErro(
            `Aguarde ${segundosRestantes} segundos antes de solicitar um novo código.`,
            429,
            'COOLDOWN_ATIVO',
            { retryAfterSeconds: segundosRestantes }
        );
    }
};

const removerDadosSensiveisUsuario = (usuario) => {
    const usuarioJson = usuario.toJSON();

    delete usuarioJson.senha;
    delete usuarioJson.reset_senha_codigo_hash;
    delete usuarioJson.reset_senha_expira_em;
    delete usuarioJson.reset_senha_enviado_em;
    delete usuarioJson.email_verificacao_codigo_hash;
    delete usuarioJson.email_verificacao_expira_em;
    delete usuarioJson.email_verificacao_enviado_em;

    return usuarioJson;
};

const gerarESalvarCodigoVerificacaoEmail = async (usuario, transaction = null) => {
    const codigo = gerarCodigo();

    await usuario.update({
        email_verificado: false,
        email_verificacao_codigo_hash: gerarHashCodigo(codigo),
        email_verificacao_expira_em: gerarDataExpiracao(),
        email_verificacao_enviado_em: new Date()
    }, { transaction });

    await enviarCodigoVerificacaoEmail({
        to: usuario.email,
        nome: usuario.nome,
        codigo
    });
};

const gerarESalvarCodigoResetSenha = async (usuario, transaction = null) => {
    const codigo = gerarCodigo();

    await usuario.update({
        reset_senha_codigo_hash: gerarHashCodigo(codigo),
        reset_senha_expira_em: gerarDataExpiracao(),
        reset_senha_enviado_em: new Date()
    }, { transaction });

    await enviarCodigoResetSenha({
        to: usuario.email,
        nome: usuario.nome,
        codigo
    });
};

const createUser = async (data) => {
    validarQualidadeSenha(data.senha);

    const novoUsuario = await sequelize.transaction(async (transaction) => {
        const usuario = await Usuario.create({
            ...data,
            role_id: 3,
            email_verificado: false
        }, { transaction });

        await gerarESalvarCodigoVerificacaoEmail(usuario, transaction);

        return usuario;
    });

    return removerDadosSensiveisUsuario(novoUsuario);
};

const loginUser = async (email, senha) => {
    const usuario = await Usuario.findOne({ where: { email } });
    
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
        throw criarErro("Credenciais inválidas.", 401, 'CREDENCIAIS_INVALIDAS');
    }

    if (!usuario.email_verificado) {
        let novoCodigoEnviado = false;

        if (codigoExpirou(usuario.email_verificacao_expira_em)) {
            garantirPodeReenviar(usuario.email_verificacao_enviado_em);
            await gerarESalvarCodigoVerificacaoEmail(usuario);
            novoCodigoEnviado = true;
        }

        throw criarErro(
            novoCodigoEnviado
                ? "E-mail ainda não verificado. Enviamos um novo código para seu e-mail."
                : "E-mail ainda não verificado. Use o código enviado para seu e-mail.",
            403,
            'EMAIL_NAO_VERIFICADO',
            { requiresEmailVerification: true }
        );
    }

    // --- Nova lógica de mapeamento de permissões ---
    const mapeamentoRoles = {
        1: 'Adm',
        2: 'Atendente',
        3: 'Normal'
    };

    // Define o nome da permissão ou um padrão caso venha um ID inválido do banco
    const tipoPermissao = mapeamentoRoles[usuario.role_id] || 'Desconhecido';

    // Incluindo o tipo de permissão e o role_id no JWT
    const token = jwt.sign(
        { 
            id: usuario.id, 
            role_id: usuario.role_id,
            permissao: tipoPermissao 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );

    // Retornando os dados para o cliente
    return { 
        token, 
        usuarioId: usuario.id,
        permissao: tipoPermissao
    };
};

const verificarEmail = async (email, codigo) => {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
        throw criarErro("Conta não encontrada para este e-mail.", 404, 'CONTA_NAO_ENCONTRADA');
    }

    if (usuario.email_verificado) {
        return { alreadyVerified: true };
    }

    if (!usuario.email_verificacao_codigo_hash || codigoExpirou(usuario.email_verificacao_expira_em)) {
        throw criarErro("Código expirado. Solicite um novo código.", 400, 'CODIGO_EXPIRADO');
    }

    if (gerarHashCodigo(codigo) !== usuario.email_verificacao_codigo_hash) {
        throw criarErro("Código inválido.", 400, 'CODIGO_INVALIDO');
    }

    await usuario.update({
        email_verificado: true,
        email_verificacao_codigo_hash: null,
        email_verificacao_expira_em: null,
        email_verificacao_enviado_em: null
    });

    return { alreadyVerified: false };
};

const reenviarCodigoVerificacaoEmail = async (email) => {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
        throw criarErro("Conta não encontrada para este e-mail.", 404, 'CONTA_NAO_ENCONTRADA');
    }

    if (usuario.email_verificado) {
        return { alreadyVerified: true };
    }

    garantirPodeReenviar(usuario.email_verificacao_enviado_em);
    await gerarESalvarCodigoVerificacaoEmail(usuario);

    return { alreadyVerified: false };
};

const solicitarResetSenha = async (email) => {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
        throw criarErro("Conta não encontrada para este e-mail.", 404, 'CONTA_NAO_ENCONTRADA');
    }

    garantirPodeReenviar(usuario.reset_senha_enviado_em);

    await sequelize.transaction(async (transaction) => {
        await gerarESalvarCodigoResetSenha(usuario, transaction);
    });
};

const resetarSenha = async (email, codigo, novaSenha) => {
    validarQualidadeSenha(novaSenha);

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario || !usuario.reset_senha_codigo_hash || !usuario.reset_senha_expira_em) {
        throw criarErro("Código inválido ou expirado.", 400, 'CODIGO_RESET_INVALIDO');
    }

    const codigoHash = gerarHashCodigo(codigo);

    if (codigoExpirou(usuario.reset_senha_expira_em) || codigoHash !== usuario.reset_senha_codigo_hash) {
        throw criarErro("Código inválido ou expirado.", 400, 'CODIGO_RESET_INVALIDO');
    }

    await usuario.update({
        senha: novaSenha,
        reset_senha_codigo_hash: null,
        reset_senha_expira_em: null,
        reset_senha_enviado_em: null
    });
};

module.exports = {
    createUser,
    loginUser,
    verificarEmail,
    reenviarCodigoVerificacaoEmail,
    solicitarResetSenha,
    resetarSenha
};
