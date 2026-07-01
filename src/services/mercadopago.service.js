'use strict';

const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

const FORMA_PAGAMENTO_MP_ID = 4;

let mpClient = null;

const obterCliente = () => {
    if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
        const error = new Error('MERCADO_PAGO_ACCESS_TOKEN não configurado.');
        error.statusCode = 500;
        throw error;
    }

    if (!mpClient) {
        mpClient = new MercadoPagoConfig({
            accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
        });
    }

    return mpClient;
};

const criarPreferencia = async ({ items, payer, externalReference }) => {
    const client = obterCliente();
    const preference = new Preference(client);

    const backUrls = {
        success: process.env.MP_BACK_URL_SUCCESS,
        failure: process.env.MP_BACK_URL_FAILURE,
        pending: process.env.MP_BACK_URL_PENDING
    };

    const notificationUrl = process.env.MP_NOTIFICATION_URL;

    const body = {
        items,
        payer,
        external_reference: externalReference,
        back_urls: backUrls,
        auto_return: 'approved'
    };

    if (notificationUrl) {
        body.notification_url = notificationUrl;
    }

    try {
        const response = await preference.create({ body });

        return {
            preferenceId: response.id,
            initPoint: response.init_point,
            sandboxInitPoint: response.sandbox_init_point
        };
    } catch (error) {
        const mpError = new Error('Falha ao criar preferência no Mercado Pago.');
        mpError.statusCode = 502;
        mpError.cause = error;
        throw mpError;
    }
};

const buscarPagamento = async (paymentId) => {
    const client = obterCliente();
    const payment = new Payment(client);

    try {
        return await payment.get({ id: paymentId });
    } catch (error) {
        const mpError = new Error('Falha ao consultar pagamento no Mercado Pago.');
        mpError.statusCode = 502;
        mpError.cause = error;
        throw mpError;
    }
};

module.exports = {
    FORMA_PAGAMENTO_MP_ID,
    criarPreferencia,
    buscarPagamento
};
