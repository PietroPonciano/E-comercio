'use strict';
const express = require('express');
const router = express.Router();

const verificarToken = require('../middlewares/auth.middleware');
const { verificarSuporte } = require('../middlewares/role.middleware');

router.get('/my', verificarToken, (req, res) => {
    res.status(200).json({ success: true, message: "Simbólico: Lista dos seus tickets abertos." });
});

router.get('/all', verificarToken, verificarSuporte, (req, res) => {
    res.status(200).json({ success: true, message: "Simbólico: Lista de todos os tickets do sistema (Acesso restrito)." });
});

router.post('/', verificarToken, (req, res) => {
    res.status(201).json({ success: true, message: "Simbólico: Ticket de suporte criado." });
});

router.post('/:id/messages', verificarToken, (req, res) => {
    const { id } = req.params;
    res.status(201).json({ success: true, message: `Simbólico: Mensagem enviada no ticket #${id}.` });
});

router.put('/:id/status', verificarToken, verificarSuporte, (req, res) => {
    const { id } = req.params;
    res.status(200).json({ success: true, message: `Simbólico: Status do ticket #${id} atualizado.` });
});

router.delete('/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    res.status(200).json({ success: true, message: `Simbólico: Ticket #${id} cancelado/deletado.` });
});

module.exports = router;
