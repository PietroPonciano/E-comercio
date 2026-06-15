const express = require('express');
const router = express.Router();

// Rota global de teste da API
router.get('/', (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: "API E-comercio rodando perfeitamente e conectada ao SQLite." 
    });
});

module.exports = router;