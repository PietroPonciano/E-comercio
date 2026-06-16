'use strict';
const express = require('express');
const router = express.Router();

const verificarToken = require('../middlewares/auth.middleware');

router.get('/profile', verificarToken, (req, res) => {
    res.status(200).json({ success: true, message: "Simbólico: Dados do seu perfil pessoal." });
});

router.put('/profile', verificarToken, (req, res) => {
    res.status(200).json({ success: true, message: "Simbólico: Seu perfil foi atualizado." });
});

router.get('/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    res.status(200).json({ success: true, message: `Simbólico: Perfil do usuário #${id} (Acesso restrito).` });
});

router.put('/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    res.status(200).json({ success: true, message: `Simbólico: Informações/Roles do usuário #${id} alteradas.` });
});

module.exports = router;