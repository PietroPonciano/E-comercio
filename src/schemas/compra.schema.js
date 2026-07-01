'use strict';

const Joi = require('joi');

const checkoutSchema = Joi.object({
    itens: Joi.array().items(
        Joi.object({
            produto_id: Joi.number().integer().positive().required(),
            quantidade: Joi.number().integer().min(1).required()
        })
    ).min(1).required(),
    forma_entrega_id: Joi.number().integer().positive().required(),
    endereco_entrega: Joi.string().min(5).max(255).optional()
});

module.exports = { checkoutSchema };
