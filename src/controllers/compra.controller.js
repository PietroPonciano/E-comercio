'use strict';

const CompraService = require('../services/compra.service');

const respostaErro = (res, error) => {
    if (error.statusCode) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    console.error(error);

    return res.status(500).json({
        success: false,
        message: 'Erro interno no servidor.'
    });
};

const checkout = async (req, res) => {
    try {
        const resultado = await CompraService.iniciarCheckout({
            usuarioId: req.usuario.id,
            itens: req.body.itens,
            formaEntregaId: req.body.forma_entrega_id,
            enderecoEntrega: req.body.endereco_entrega
        });

        return res.status(200).json({
            success: true,
            message: 'Checkout iniciado com sucesso.',
            data: resultado
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

const listarMinhasCompras = async (req, res) => {
    try {
        const compras = await CompraService.listarComprasDoUsuario(req.usuario.id);

        return res.status(200).json({
            success: true,
            data: compras
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

const buscarMinhaCompra = async (req, res) => {
    try {
        const compra = await CompraService.buscarCompraPorId(req.params.id, req.usuario.id);

        return res.status(200).json({
            success: true,
            data: compra
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

const webhook = async (req, res) => {
    try {
        const paymentId =
            req.query['data.id'] ||
            req.query.id ||
            req.body?.data?.id;

        const topic = req.query.topic || req.body?.type;

        if (!paymentId) {
            return res.status(200).json({ success: true, message: 'Notificação recebida sem ID de pagamento.' });
        }

        if (topic && topic !== 'payment') {
            return res.status(200).json({ success: true, message: 'Tipo de notificação ignorado.' });
        }

        const resultado = await CompraService.processarWebhook({ paymentId: String(paymentId) });

        return res.status(200).json({
            success: true,
            data: resultado
        });
    } catch (error) {
        console.error('Erro no webhook Mercado Pago:', error);
        return res.status(200).json({
            success: false,
            message: 'Notificação recebida, mas houve erro no processamento.'
        });
    }
};

module.exports = {
    checkout,
    listarMinhasCompras,
    buscarMinhaCompra,
    webhook
};
