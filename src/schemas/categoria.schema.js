'use strict';
const Joi = require('joi');

const categoriaBaseSchema = {
    nome: Joi.string().min(2).max(50).messages({
        'string.base': 'O nome deve ser um texto.',
        'string.empty': 'O nome não pode estar vazio.',
        'string.min': 'O nome deve ter pelo menos {#limit} caracteres.',
        'string.max': 'O nome não pode ter mais que {#limit} caracteres.'
    }),
    descricao: Joi.string().allow('', null)
};

const createCategoriaSchema = Joi.object({
    nome: categoriaBaseSchema.nome.required().messages({ 'any.required': 'O campo nome é obrigatório.' }),
    descricao: categoriaBaseSchema.descricao.optional()
});

const updateCategoriaSchema = Joi.object({
    nome: categoriaBaseSchema.nome.optional(),
    descricao: categoriaBaseSchema.descricao.optional()
}).min(1).messages({
    'object.min': 'Ao menos um campo deve ser enviado para atualização.'
});

module.exports = { createCategoriaSchema, updateCategoriaSchema };