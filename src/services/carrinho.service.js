'use strict';

const {
    Carrinho,
    ItemCarrinho,
    Produto,
    FormaEntrega,
    sequelize
} = require('../models');

const criarErro = (message, statusCode = 400) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const paraNumero = (valor) => Number.parseFloat(valor);

const obterOuCriarCarrinho = async (usuarioId, transaction) => {
    const [carrinho] = await Carrinho.findOrCreate({
        where: { usuario_id: usuarioId },
        defaults: { usuario_id: usuarioId },
        transaction
    });

    return carrinho;
};

const validarItensDoBanco = async (itensPayload) => {
    if (!itensPayload.length) {
        throw criarErro('O carrinho deve conter ao menos um produto.');
    }

    const idsUnicos = [...new Set(itensPayload.map((item) => item.produto_id))];
    const produtos = await Produto.findAll({
        where: { id: idsUnicos, ativo: true }
    });

    if (produtos.length !== idsUnicos.length) {
        throw criarErro('Um ou mais produtos não foram encontrados ou estão indisponíveis.');
    }

    const produtosPorId = new Map(produtos.map((produto) => [produto.id, produto]));
    const itensValidados = [];

    for (const item of itensPayload) {
        const produto = produtosPorId.get(item.produto_id);

        if (item.quantidade > produto.quantidade) {
            throw criarErro(`Estoque insuficiente para o produto "${produto.nome}". Disponível: ${produto.quantidade}.`);
        }

        itensValidados.push({
            produto_id: produto.id,
            quantidade: item.quantidade,
            produto
        });
    }

    return itensValidados;
};

const calcularSubtotal = (itensValidados) => {
    return itensValidados.reduce((total, item) => {
        return total + (paraNumero(item.produto.preco) * item.quantidade);
    }, 0);
};

const sincronizarItensCarrinho = async (carrinhoId, itensValidados, transaction) => {
    await ItemCarrinho.destroy({
        where: { carrinho_id: carrinhoId },
        transaction
    });

    await ItemCarrinho.bulkCreate(
        itensValidados.map((item) => ({
            carrinho_id: carrinhoId,
            produto_id: item.produto_id,
            quantidade: item.quantidade
        })),
        { transaction }
    );
};

const prepararCheckout = async ({ usuarioId, itens, formaEntregaId, enderecoEntrega }) => {
    const formaEntrega = await FormaEntrega.findByPk(formaEntregaId);

    if (!formaEntrega) {
        throw criarErro('Forma de entrega inválida.');
    }

    const itensValidados = await validarItensDoBanco(itens);
    const subtotal = calcularSubtotal(itensValidados);
    const frete = paraNumero(formaEntrega.valor_fixo_frete);
    const total = Number((subtotal + frete).toFixed(2));

    return sequelize.transaction(async (transaction) => {
        const carrinho = await obterOuCriarCarrinho(usuarioId, transaction);

        await sincronizarItensCarrinho(carrinho.id, itensValidados, transaction);

        await carrinho.update({
            forma_entrega_id: formaEntregaId,
            endereco_entrega: enderecoEntrega
        }, { transaction });

        return {
            carrinho,
            itensValidados,
            formaEntrega,
            subtotal,
            frete,
            total
        };
    });
};

const montarItensMercadoPago = (itensValidados, formaEntrega, frete) => {
    const itensMP = itensValidados.map((item) => ({
        id: String(item.produto_id),
        title: item.produto.nome,
        quantity: item.quantidade,
        unit_price: paraNumero(item.produto.preco),
        currency_id: 'BRL'
    }));

    if (frete > 0) {
        itensMP.push({
            id: 'frete',
            title: `Frete - ${formaEntrega.nome}`,
            quantity: 1,
            unit_price: frete,
            currency_id: 'BRL'
        });
    }

    return itensMP;
};

const buscarCarrinhoComItens = async (carrinhoId, transaction) => {
    const carrinho = await Carrinho.findByPk(carrinhoId, {
        include: [{
            model: ItemCarrinho,
            as: 'itens',
            include: [{ model: Produto, as: 'produto' }]
        }, {
            model: FormaEntrega,
            as: 'forma_entrega'
        }],
        transaction
    });

    if (!carrinho || !carrinho.itens.length) {
        throw criarErro('Carrinho não encontrado ou vazio.', 404);
    }

    return carrinho;
};

const limparCarrinho = async (carrinhoId, transaction) => {
    await ItemCarrinho.destroy({
        where: { carrinho_id: carrinhoId },
        transaction
    });

    await Carrinho.update({
        forma_entrega_id: null,
        endereco_entrega: null,
        mp_preference_id: null
    }, {
        where: { id: carrinhoId },
        transaction
    });
};

const parseExternalReference = (externalReference) => {
    if (!externalReference) {
        return null;
    }

    if (externalReference.startsWith('carrinho:')) {
        const carrinhoId = Number.parseInt(externalReference.replace('carrinho:', ''), 10);
        return Number.isNaN(carrinhoId) ? null : carrinhoId;
    }

    const carrinhoId = Number.parseInt(externalReference, 10);
    return Number.isNaN(carrinhoId) ? null : carrinhoId;
};

module.exports = {
    prepararCheckout,
    montarItensMercadoPago,
    validarItensDoBanco,
    calcularSubtotal,
    buscarCarrinhoComItens,
    limparCarrinho,
    parseExternalReference,
    paraNumero
};
