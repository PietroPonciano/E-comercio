'use strict';

const express = require('express');
const router = express.Router();

const verificarToken = require('../middlewares/auth.middleware');
const { verificarSuporte } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { checkoutSchema } = require('../schemas/compra.schema');
const CompraController = require('../controllers/compra.controller');

router.post('/checkout', verificarToken, validate(checkoutSchema), CompraController.checkout);

router.get('/my', verificarToken, CompraController.listarMinhasCompras);

router.get('/my/:id', verificarToken, CompraController.buscarMinhaCompra);

router.get('/user/:id', verificarToken, verificarSuporte, (req, res) => {
    const { id } = req.params;
    res.status(200).json({ success: true, message: `Simbólico: Histórico de compras do usuário #${id} (Acesso restrito).` });
});

router.post('/:id/refund', verificarToken, (req, res) => {
    const { id } = req.params;
    res.status(200).json({ success: true, message: `Simbólico: Solicitação de reembolso para a compra #${id} enviada.` });
});

router.put('/:id/status', verificarToken, verificarSuporte, (req, res) => {
    const { id } = req.params;
    res.status(200).json({ success: true, message: `Simbólico: Status logístico da compra #${id} atualizado.` });
});

router.delete('/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    res.status(200).json({ success: true, message: `Simbólico: Pedido #${id} cancelado antes do envio.` });
});

module.exports = router;
