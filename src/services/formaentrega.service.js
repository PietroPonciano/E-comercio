'use strict';

const { FormaEntrega } = require('../models');

const formatarFormaEntrega = (formaEntrega) => {
    const formaEntregaJson = formaEntrega.toJSON();

    return {
        id: formaEntregaJson.id,
        nome: formaEntregaJson.nome,
        valor_fixo_frete: Number.parseFloat(formaEntregaJson.valor_fixo_frete)
    };
};

const listarFormasEntrega = async () => {
    const formasEntrega = await FormaEntrega.findAll({
        order: [['nome', 'ASC']]
    });

    return formasEntrega.map(formatarFormaEntrega);
};

module.exports = {
    listarFormasEntrega
};
