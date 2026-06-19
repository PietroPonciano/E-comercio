'use strict';

const Joi = require('joi');

const createTicketSchema = Joi.object({
    titulo: Joi.string().min(5).max(100).required().messages({
        'string.base': 'O título deve ser um texto.',
        'string.empty': 'O título não pode estar vazio.',
        'string.min': 'O título deve ter no mínimo {#limit} caracteres.',
        'string.max': 'O título deve ter no máximo {#limit} caracteres.',
        'any.required': 'O campo título é obrigatório.'
    })
});

const createMensagemSchema = Joi.object({
    mensagem: Joi.string().max(5000).allow('', null).messages({
        'string.max': 'A mensagem deve ter no máximo {#limit} caracteres.'
    }),
    imagem_url: Joi.string().uri().allow('', null).messages({
        'string.uri': 'A imagem_url deve ser uma URL válida.'
    })
}).or('mensagem', 'imagem_url').messages({
    'object.missing': 'A mensagem deve possuir ao menos o texto ou a URL de uma imagem.'
});

const updateTicketStatusSchema = Joi.object({
    status: Joi.string().valid('aberto', 'em_atendimento', 'fechado').required().messages({
        'any.only': 'O status deve ser um dos seguintes valores: aberto, em_atendimento, fechado.',
        'any.required': 'O campo status é obrigatório.'
    })
});

module.exports = {
    createTicketSchema,
    createMensagemSchema,
    updateTicketStatusSchema
};