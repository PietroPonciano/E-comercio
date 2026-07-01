'use strict';

const {
    Compra,
    ItemCompra,
    PagamentoMP,
    Produto,
    Usuario,
    FormaEntrega,
    FormaPagamento,
    Carrinho,
    sequelize
} = require('../models');

const MercadoPagoService = require('./mercadopago.service');
const CarrinhoService = require('./carrinho.service');

const criarErro = (message, statusCode = 400) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const formatarCompra = (compra) => {
    const compraJson = compra.toJSON();

    return {
        id: compraJson.id,
        nome: compraJson.nome,
        endereco_entrega: compraJson.endereco_entrega,
        preco_total: compraJson.preco_total,
        status: compraJson.status,
        mp_payment_id: compraJson.mp_payment_id,
        mp_preference_id: compraJson.mp_preference_id,
        forma_pagamento: compraJson.forma_pagamento,
        forma_entrega: compraJson.forma_entrega,
        itens: (compraJson.itens || []).map((item) => ({
            produto_id: item.produto_id,
            quantidade: item.quantidade,
            preco_unitario: item.preco_unitario,
            produto: item.produto ? {
                id: item.produto.id,
                nome: item.produto.nome
            } : undefined
        })),
        createdAt: compraJson.createdAt
    };
};

const includeCompraCompleta = [
    {
        model: FormaPagamento,
        as: 'forma_pagamento',
        attributes: ['id', 'nome']
    },
    {
        model: FormaEntrega,
        as: 'forma_entrega',
        attributes: ['id', 'nome', 'valor_fixo_frete']
    },
    {
        model: ItemCompra,
        as: 'itens',
        include: [{
            model: Produto,
            as: 'produto',
            attributes: ['id', 'nome']
        }]
    }
];

const iniciarCheckout = async ({ usuarioId, itens, formaEntregaId, enderecoEntrega }) => {
    const usuario = await Usuario.findByPk(usuarioId);

    if (!usuario) {
        throw criarErro('Usuário não encontrado.', 404);
    }

    const enderecoFinal = enderecoEntrega || usuario.endereco;
    const checkout = await CarrinhoService.prepararCheckout({
        usuarioId,
        itens,
        formaEntregaId,
        enderecoEntrega: enderecoFinal
    });

    const itensMP = CarrinhoService.montarItensMercadoPago(
        checkout.itensValidados,
        checkout.formaEntrega,
        checkout.frete
    );

    const externalReference = `carrinho:${checkout.carrinho.id}`;

    const preferencia = await MercadoPagoService.criarPreferencia({
        items: itensMP,
        payer: { email: usuario.email },
        externalReference
    });

    await checkout.carrinho.update({ mp_preference_id: preferencia.preferenceId });

    return {
        carrinho_id: checkout.carrinho.id,
        total: checkout.total,
        preference_id: preferencia.preferenceId,
        init_point: preferencia.initPoint,
        sandbox_init_point: preferencia.sandboxInitPoint
    };
};

const processarPagamentoAprovado = async (pagamentoMP, carrinhoId, transaction) => {
    const carrinho = await CarrinhoService.buscarCarrinhoComItens(carrinhoId, transaction);

    if (carrinho.usuario_id !== pagamentoMP.usuario_id) {
        throw criarErro('Carrinho não pertence ao usuário do pagamento.', 403);
    }

    const itensPayload = carrinho.itens.map((item) => ({
        produto_id: item.produto_id,
        quantidade: item.quantidade
    }));

    const itensValidados = await CarrinhoService.validarItensDoBanco(itensPayload);
    const subtotal = CarrinhoService.calcularSubtotal(itensValidados);
    const frete = CarrinhoService.paraNumero(carrinho.forma_entrega.valor_fixo_frete);
    const total = Number((subtotal + frete).toFixed(2));

    const compra = await Compra.create({
        nome: `Pedido #${Date.now()}`,
        endereco_entrega: carrinho.endereco_entrega,
        preco_total: total,
        status: 'pago',
        usuario_id: carrinho.usuario_id,
        forma_pagamento_id: MercadoPagoService.FORMA_PAGAMENTO_MP_ID,
        forma_entrega_id: carrinho.forma_entrega_id,
        mp_preference_id: carrinho.mp_preference_id,
        mp_payment_id: String(pagamentoMP.mp_payment_id)
    }, { transaction });

    await ItemCompra.bulkCreate(
        itensValidados.map((item) => ({
            compra_id: compra.id,
            produto_id: item.produto_id,
            quantidade: item.quantidade,
            preco_unitario: item.produto.preco
        })),
        { transaction }
    );

    for (const item of itensValidados) {
        await Produto.decrement('quantidade', {
            by: item.quantidade,
            where: { id: item.produto_id },
            transaction
        });
    }

    await CarrinhoService.limparCarrinho(carrinhoId, transaction);

    await pagamentoMP.update({ compra_id: compra.id }, { transaction });

    return compra;
};

const processarWebhook = async ({ paymentId }) => {
    const pagamentoOficial = await MercadoPagoService.buscarPagamento(paymentId);
    const mpPaymentId = String(pagamentoOficial.id);
    const status = pagamentoOficial.status;
    const carrinhoId = CarrinhoService.parseExternalReference(pagamentoOficial.external_reference);

    let pagamentoRegistrado = await PagamentoMP.findOne({
        where: { mp_payment_id: mpPaymentId }
    });

    if (pagamentoRegistrado && pagamentoRegistrado.compra_id) {
        return {
            processado: false,
            motivo: 'Pagamento já processado anteriormente.',
            status,
            compra_id: pagamentoRegistrado.compra_id
        };
    }

    let usuarioId = null;

    if (carrinhoId) {
        const carrinhoBasico = await Carrinho.findByPk(carrinhoId);
        usuarioId = carrinhoBasico ? carrinhoBasico.usuario_id : null;
    }

    if (!pagamentoRegistrado) {
        pagamentoRegistrado = await PagamentoMP.create({
            mp_payment_id: mpPaymentId,
            status,
            usuario_id: usuarioId,
            carrinho_id: carrinhoId,
            mp_preference_id: pagamentoOficial.preference_id
                ? String(pagamentoOficial.preference_id)
                : null
        });
    } else {
        await pagamentoRegistrado.update({ status });
    }

    if (status !== 'approved') {
        return {
            processado: false,
            motivo: 'Pagamento não aprovado. Status registrado para consulta futura.',
            status
        };
    }

    if (!carrinhoId) {
        return {
            processado: false,
            motivo: 'external_reference inválido ou ausente.',
            status
        };
    }

    try {
        const compra = await sequelize.transaction(async (transaction) => {
            const pagamentoAtual = await PagamentoMP.findOne({
                where: { mp_payment_id: mpPaymentId },
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (pagamentoAtual.compra_id) {
                return { id: pagamentoAtual.compra_id };
            }

            return processarPagamentoAprovado(pagamentoAtual, carrinhoId, transaction);
        });

        return {
            processado: true,
            status,
            compra_id: compra.id
        };
    } catch (error) {
        await pagamentoRegistrado.update({ status: `${status}_erro_processamento` });
        throw error;
    }
};

const listarComprasDoUsuario = async (usuarioId) => {
    const compras = await Compra.findAll({
        where: { usuario_id: usuarioId },
        include: includeCompraCompleta,
        order: [['createdAt', 'DESC']]
    });

    return compras.map(formatarCompra);
};

const buscarCompraPorId = async (compraId, usuarioId) => {
    const compra = await Compra.findOne({
        where: { id: compraId, usuario_id: usuarioId },
        include: includeCompraCompleta
    });

    if (!compra) {
        throw criarErro('Compra não encontrada.', 404);
    }

    return formatarCompra(compra);
};

module.exports = {
    iniciarCheckout,
    processarWebhook,
    listarComprasDoUsuario,
    buscarCompraPorId
};
