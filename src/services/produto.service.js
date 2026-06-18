'use strict';

const { Produto, Categoria } = require('../models');

const criarErro = (message, statusCode = 400) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const selecionarCampos = (dados, camposPermitidos) => {
    return camposPermitidos.reduce((resultado, campo) => {
        if (Object.prototype.hasOwnProperty.call(dados, campo)) {
            resultado[campo] = dados[campo];
        }

        return resultado;
    }, {});
};

const includeCategoria = {
    model: Categoria,
    as: 'categoria',
    attributes: ['id', 'nome', 'descricao']
};

const formatarProduto = (produto) => {
    const produtoJson = produto.toJSON();

    return {
        id: produtoJson.id,
        nome: produtoJson.nome,
        descricao: produtoJson.descricao,
        imagem_url: produtoJson.imagem_url,
        preco: produtoJson.preco,
        quantidade: produtoJson.quantidade,
        avaliacao: produtoJson.avaliacao,
        ativo: produtoJson.ativo,
        categoria: produtoJson.categoria
    };
};

const garantirCategoriaExiste = async (categoriaId) => {
    const categoria = await Categoria.findByPk(categoriaId);

    if (!categoria) {
        throw criarErro("Categoria não encontrada.", 400);
    }
};

const buscarProdutoAtivoOuFalhar = async (id) => {
    const produto = await Produto.findOne({
        where: { id, ativo: true },
        include: includeCategoria
    });

    if (!produto) {
        throw criarErro("Produto não encontrado.", 404);
    }

    return produto;
};

const listarProdutos = async ({ page = 1, limit = 10 }) => {
    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const offset = (pageNumber - 1) * limitNumber;

    const { count, rows } = await Produto.findAndCountAll({
        where: { ativo: true },
        include: includeCategoria,
        limit: limitNumber,
        offset,
        order: [['id', 'ASC']]
    });

    return {
        data: rows.map(formatarProduto),
        pagination: {
            page: pageNumber,
            limit: limitNumber,
            total: count,
            totalPages: Math.ceil(count / limitNumber)
        }
    };
};

const buscarProdutoPorId = async (id) => {
    const produto = await buscarProdutoAtivoOuFalhar(id);

    return formatarProduto(produto);
};

const criarProduto = async (dados) => {
    await garantirCategoriaExiste(dados.categoria_id);

    const dadosPermitidos = selecionarCampos(dados, [
        'nome',
        'descricao',
        'imagem_url',
        'preco',
        'quantidade',
        'categoria_id'
    ]);

    const produto = await Produto.create(dadosPermitidos);

    const produtoComCategoria = await Produto.findByPk(produto.id, {
        include: includeCategoria
    });

    return formatarProduto(produtoComCategoria);
};

const atualizarProduto = async (id, dados) => {
    const produto = await buscarProdutoAtivoOuFalhar(id);

    if (dados.categoria_id) {
        await garantirCategoriaExiste(dados.categoria_id);
    }

    const dadosPermitidos = selecionarCampos(dados, [
        'nome',
        'descricao',
        'imagem_url',
        'preco',
        'quantidade',
        'categoria_id'
    ]);

    await produto.update(dadosPermitidos);

    const produtoAtualizado = await Produto.findByPk(produto.id, {
        include: includeCategoria
    });

    return formatarProduto(produtoAtualizado);
};

const desativarProduto = async (id) => {
    const produto = await buscarProdutoAtivoOuFalhar(id);

    await produto.update({ ativo: false });
};

module.exports = {
    listarProdutos,
    buscarProdutoPorId,
    criarProduto,
    atualizarProduto,
    desativarProduto
};
