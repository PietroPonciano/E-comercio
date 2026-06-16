'use strict';
const express = require('express');
const router = express.Router();

const verificarToken = require('../middlewares/auth.middleware');

router.get('/', (req, res) => {
    res.status(200).json({ success: true, message: "Simbólico: Catálogo de produtos retornado." });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    res.status(200).json({ success: true, message: `Simbólico: Informações do produto #${id}.` });
});

router.post('/', verificarToken,(req, res) => {
    res.status(201).json({ success: true, message: "Simbólico: Produto adicionado ao catálogo (Acesso restrito)." });
});

router.put('/:id', verificarToken,(req, res) => {
    const { id } = req.params;
    res.status(200).json({ success: true, message: `Simbólico: Produto #${id} editado com sucesso.` });
});

router.delete('/:id', verificarToken,(req, res) => {
    const { id } = req.params;
    res.status(200).json({ success: true, message: `Simbólico: Produto #${id} removido do catálogo.` });
});

module.exports = router;