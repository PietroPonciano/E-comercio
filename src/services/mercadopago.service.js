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

const HOSTS_INVALIDOS_MP = new Set(['localhost', '127.0.0.1', '0.0.0.0']);

const urlValidaParaMercadoPago = (url) => {
    if (!url || typeof url !== 'string') {
        return false;
    }

    try {
        const parsed = new URL(url.trim());

        return parsed.protocol === 'https:'
            && !HOSTS_INVALIDOS_MP.has(parsed.hostname);
    } catch {
        return false;
    }
};

const montarBackUrls = () => {
    const baseFrontend = process.env.MP_FRONTEND_URL || process.env.FRONTEND_URL;
    const baseNormalizada = baseFrontend ? baseFrontend.replace(/\/$/, '') : null;

    const success = process.env.MP_BACK_URL_SUCCESS
        || (baseNormalizada ? `${baseNormalizada}/checkout/success` : null);
    const failure = process.env.MP_BACK_URL_FAILURE
        || (baseNormalizada ? `${baseNormalizada}/checkout/failure` : null);
    const pending = process.env.MP_BACK_URL_PENDING
        || (baseNormalizada ? `${baseNormalizada}/checkout/pending` : null);

    const backUrls = {};

    if (success) {
        backUrls.success = success;
    }

    if (failure) {
        backUrls.failure = failure;
    }

    if (pending) {
        backUrls.pending = pending;
    }

    const backUrlsValidas = Object.fromEntries(
        Object.entries(backUrls).filter(([, url]) => urlValidaParaMercadoPago(url))
    );

    return {
        backUrls: backUrlsValidas,
        podeUsarAutoReturn: Boolean(backUrlsValidas.success)
    };
};


const extrairMensagemErroMP = (error) => {
    const causa = error.cause?.[0];

    if (typeof causa === 'object' && causa?.description) {
        return causa.description;
    }

    if (typeof error.message === 'string' && error.message) {
        return error.message;
    }

    return 'Falha ao criar preferência no Mercado Pago.';
};

const criarPreferencia = async ({ items, payer, externalReference }) => {
    const client = obterCliente();
    const preference = new Preference(client);

    const { backUrls, podeUsarAutoReturn } = montarBackUrls();
    const notificationUrl = process.env.MP_NOTIFICATION_URL;

    const body = {
        items,
        payer,
        external_reference: externalReference
    };

    if (Object.keys(backUrls).length > 0) {
        body.back_urls = backUrls;
    }

    // auto_return exige back_urls.success com HTTPS público; URLs http/localhost são descartadas pela API.
    if (podeUsarAutoReturn) {
        body.auto_return = 'approved';
    }

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
        console.error('Erro ao criar preferência MP:', error.response?.data || error.cause || error);

        const mpError = new Error(extrairMensagemErroMP(error));
        mpError.statusCode = error.status || 502;
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
        console.error('Erro ao consultar pagamento MP:', error.response?.data || error.cause || error);

        const mpError = new Error(extrairMensagemErroMP(error));
        mpError.statusCode = error.status || 502;
        mpError.cause = error;
        throw mpError;
    }
};

module.exports = {
    FORMA_PAGAMENTO_MP_ID,
    criarPreferencia,
    buscarPagamento
};
