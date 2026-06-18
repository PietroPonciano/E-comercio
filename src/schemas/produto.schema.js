'use strict';

const Joi = require('joi');

const produtoBaseSchema = {
    nome: Joi.string().min(2).max(100),
    descricao: Joi.string().allow(null, ''),
    imagem_url: Joi.string().uri().max(255).allow(null, ''),
    preco: Joi.number().precision(2).min(0),
    quantidade: Joi.number().integer().min(0),
    categoria_id: Joi.number().integer().positive()
};

const createProdutoSchema = Joi.object({
    nome: produtoBaseSchema.nome.required(),
    descricao: produtoBaseSchema.descricao.optional(),
    imagem_url: produtoBaseSchema.imagem_url.optional(),
    preco: produtoBaseSchema.preco.required(),
    quantidade: produtoBaseSchema.quantidade.required(),
    categoria_id: produtoBaseSchema.categoria_id.required()
});

const updateProdutoSchema = Joi.object(produtoBaseSchema).min(1);

module.exports = { createProdutoSchema, updateProdutoSchema };
