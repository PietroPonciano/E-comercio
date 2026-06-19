'use strict';
const express = require('express');
const router = express.Router();

// Middlewares obrigatórios
const verificarToken = require('../middlewares/auth.middleware');
const { verificarAdmin } = require('../middlewares/role.middleware');
const validarIdNumerico = require('../utils/validarIdNumerico')

// Controller
const CategoriaController = require('../controllers/categoria.controller');

// Todas as rotas agora possuem verificarToken, verificarAdmin e seu respectivo controller
router.get('/', verificarToken, verificarAdmin, CategoriaController.list);

router.post('/', verificarToken, verificarAdmin, CategoriaController.create);

// Rotas com parâmetros numéricos recebem o middleware validarIdNumerico
router.put('/:id', verificarToken, verificarAdmin, validarIdNumerico, CategoriaController.update);

router.delete('/:id', verificarToken, verificarAdmin,  validarIdNumerico, CategoriaController.remove);

module.exports = router;