'use strict';

const ProdutoService = require('../services/produto.service');

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
        const result = await ProdutoService.listarProdutos(req.query);

        return res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

const getById = async (req, res) => {
    try {
        const produto = await ProdutoService.buscarProdutoPorId(req.params.id);

        return res.status(200).json({
            success: true,
            data: produto
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

const create = async (req, res) => {
    try {
        const produto = await ProdutoService.criarProduto(req.body);

        return res.status(201).json({
            success: true,
            message: "Produto criado com sucesso.",
            data: produto
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

const update = async (req, res) => {
    try {
        const produto = await ProdutoService.atualizarProduto(req.params.id, req.body);

        return res.status(200).json({
            success: true,
            message: "Produto atualizado com sucesso.",
            data: produto
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

const remove = async (req, res) => {
    try {
        await ProdutoService.desativarProduto(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Produto removido com sucesso."
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

module.exports = { list, getById, create, update, remove };
