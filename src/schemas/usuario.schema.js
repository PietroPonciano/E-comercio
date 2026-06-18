'use strict';

const Joi = require('joi');

const camposEditaveisUsuario = {
    nome: Joi.string().min(2).max(50),
    sobrenome: Joi.string().min(2).max(50),
    cpf: Joi.string().length(11).pattern(/^[0-9]+$/),
    telefone: Joi.string().max(20).allow(null, ''),
    endereco: Joi.string().min(3).max(255)
};

const updateProfileSchema = Joi.object({
    ...camposEditaveisUsuario,
    senha: Joi.string().min(8)
}).min(1);

const updateUserSchema = Joi.object({
    ...camposEditaveisUsuario
}).min(1);

module.exports = { updateProfileSchema, updateUserSchema };
