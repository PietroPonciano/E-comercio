'use strict';

const { Categoria, Produto } = require('../models');

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

const formatarCategoria = (categoria) => {
    const categoriaJson = categoria.toJSON();

    return {
        id: categoriaJson.id,
        nome: categoriaJson.nome,
        descricao: categoriaJson.descricao
        // Removido o campo 'ativo' pois ele não existe no model Categoria
    };
};

const buscarCategoriaOuFalhar = async (id) => {
    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
        throw criarErro("Categoria não encontrada.", 404);
    }

    return categoria;
};

const listarCategorias = async () => {
    // Busca todas as categorias sem o filtro de 'ativo'
    const categories = await Categoria.findAll({
        order: [['nome', 'ASC']]
    });

    return categories.map(formatarCategoria);
};

const criarCategoria = async (dados) => {
    const dadosPermitidos = selecionarCampos(dados, ['nome', 'descricao']);

    // Valida a unicidade (unique: true no model) antes de tentar inserir
    const nomeExiste = await Categoria.findOne({
        where: { nome: dadosPermitidos.nome }
    });

    if (nomeExiste) {
        throw criarErro("Já existe uma categoria com este nome.", 400);
    }

    const categoria = await Categoria.create(dadosPermitidos);

    return formatarCategoria(categoria);
};

const atualizarCategoria = async (id, dados) => {
    const categoria = await buscarCategoriaOuFalhar(id);

    const dadosPermitidos = selecionarCampos(dados, ['nome', 'descricao']);

    if (dadosPermitidos.nome) {
        const nomeExiste = await Categoria.findOne({
            where: { nome: dadosPermitidos.nome }
        });
        
        // Se o nome existir e não for da própria categoria atual, barra a edição
        if (nomeExiste && nomeExiste.id !== Number(id)) {
            throw criarErro("Já existe outra categoria com este nome.", 400);
        }
    }

    await categoria.update(dadosPermitidos);

    return formatarCategoria(categoria);
};

const excluirCategoria = async (id) => {
    // 1. Garante que a categoria existe no banco ou falha com 404
    const categoria = await buscarCategoriaOuFalhar(id);

    // 2. Regra de negócio: impede a exclusão se houver produtos associados a ela
    const possuiProdutos = await Produto.findOne({
        where: { categoria_id: id }
    });

    if (possuiProdutos) {
        throw criarErro("Não é possível excluir uma categoria que possui produtos vinculados.", 400);
    }

    // 3. Exclusão física (Hard Delete) já que o model Categoria não usa a propriedade 'ativo'
    await categoria.destroy();
};

module.exports = {
    listarCategorias,
    criarCategoria,
    atualizarCategoria,
    excluirCategoria // Exportado com sucesso
};