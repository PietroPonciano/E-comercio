'use strict';
const Joi = require('joi');

const registerSchema = Joi.object({
    nome: Joi.string().min(2).max(50).required(),
    sobrenome: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    senha: Joi.string().min(6).required(),
    endereco: Joi.string().required(),
    cpf: Joi.string().length(11).pattern(/^[0-9]+$/).required(), // CPF apenas números
    telefone: Joi.string().optional()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    senha: Joi.string().required()
});


module.exports = { registerSchema, loginSchema };