'use strict';

const SENHAS_COMUNS = [
    '123456',
    '12345678',
    '123456789',
    'password',
    'senha123',
    'qwerty',
    'admin123'
];

const validarQualidadeSenha = (senha) => {
    const erros = [];

    if (!senha || typeof senha !== 'string') {
        throw new Error('A senha é obrigatória.');
    }

    if (senha.length < 8) {
        erros.push('ter pelo menos 8 caracteres');
    }

    if (!/[A-Z]/.test(senha)) {
        erros.push('ter pelo menos uma letra maiúscula');
    }

    if (!/[a-z]/.test(senha)) {
        erros.push('ter pelo menos uma letra minúscula');
    }

    if (!/[0-9]/.test(senha)) {
        erros.push('ter pelo menos um número');
    }

    if (!/[^A-Za-z0-9]/.test(senha)) {
        erros.push('ter pelo menos um caractere especial');
    }

    if (SENHAS_COMUNS.includes(senha.toLowerCase())) {
        erros.push('não ser uma senha comum ou fácil de adivinhar');
    }

    if (erros.length > 0) {
        throw new Error(`Senha fraca. A senha deve ${erros.join(', ')}.`);
    }
};

module.exports = { validarQualidadeSenha };
