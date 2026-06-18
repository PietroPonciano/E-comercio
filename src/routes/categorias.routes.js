'use strict';
const express = require('express');
const router = express.Router();

const verificarToken = require('../middlewares/auth.middleware');
const { verificarAdmin } = require('../middlewares/role.middleware');

router.get('/', (req, res) => {
    res.status(200).json({ success: true, message: "Simbólico: Lista de categorias retornada." });
});

router.post('/', verificarToken, verificarAdmin, (req, res) => {
    res.status(201).json({ success: true, message: "Simbólico: Categoria criada com sucesso." });
});

router.put('/:id', verificarToken, verificarAdmin, (req, res) => {
    const { id } = req.params;
    res.status(200).json({ success: true, message: `Simbólico: Categoria #${id} editada com sucesso.` });
});

module.exports = router;
