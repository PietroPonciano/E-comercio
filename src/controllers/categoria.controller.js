'use strict';

const CategoriaService = require('../services/categoria.service');
const { createCategoriaSchema, updateCategoriaSchema } = require('../schemas/categoria.schema');

const respostaErro = (res, error) => {
    if (error.statusCode) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    return res.status(500).json({
        success: false,
        message: "Erro interno no servidor."
    });
};

const list = async (req, res) => {
    try {
        const categorias = await CategoriaService.listarCategorias();

        return res.status(200).json({
            success: true,
            data: categorias
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

const create = async (req, res) => {
    try {
        // Validação do Joi antes de enviar ao Service
        const { error, value } = createCategoriaSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const categoria = await CategoriaService.criarCategoria(value);

        return res.status(201).json({
            success: true,
            message: "Categoria criada com sucesso.",
            data: categoria
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

const update = async (req, res) => {
    try {
        // Validação do Joi antes de enviar ao Service
        const { error, value } = updateCategoriaSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const categoria = await CategoriaService.atualizarCategoria(req.params.id, value);

        return res.status(200).json({
            success: true,
            message: "Categoria atualizada com sucesso.",
            data: categoria
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

const remove = async (req, res) => {
    try {
        await CategoriaService.excluirCategoria(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Categoria removida com sucesso."
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

module.exports = { list, create, update, remove };