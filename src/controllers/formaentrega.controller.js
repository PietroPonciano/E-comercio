'use strict';

const FormaEntregaService = require('../services/formaentrega.service');

const respostaErro = (res, error) => {
    if (error.statusCode) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    return res.status(500).json({
        success: false,
        message: 'Erro interno no servidor.'
    });
};

const list = async (req, res) => {
    try {
        const formasEntrega = await FormaEntregaService.listarFormasEntrega();

        return res.status(200).json({
            success: true,
            data: formasEntrega
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

module.exports = { list };
