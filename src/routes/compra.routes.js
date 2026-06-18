'use strict';
const express = require('express');
const router = express.Router();

const verificarToken = require('../middlewares/auth.middleware');
const { verificarSuporte } = require('../middlewares/role.middleware');

router.post('/',verificarToken, (req, res) => {
    res.status(201).json({ success: true, message: "Simbólico: Compra realizada com sucesso." });
});

router.get('/my', verificarToken, (req, res) => {
    res.status(200).json({ success: true, message: "Simbólico: Lista do seu histórico de compras." });
});

router.get('/user/:id', verificarToken, verificarSuporte, (req, res) => {
    const { id } = req.params;
    res.status(200).json({ success: true, message: `Simbólico: Histórico de compras do usuário #${id} (Acesso restrito).` });
});

router.post('/:id/refund', verificarToken,(req, res) => {
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
