'use strict';
const express = require('express');
const router = express.Router();

const verificarToken = require('../middlewares/auth.middleware');
const { verificarAdmin } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const ProdutoController = require('../controllers/produtos.controller');
const { createProdutoSchema, updateProdutoSchema } = require('../schemas/produto.schema');
const validarIdNumerico = require('../utils/validarIdNumerico')


router.get('/', ProdutoController.list);

router.get('/:id', validarIdNumerico, ProdutoController.getById);

router.post('/', verificarToken, verificarAdmin, validate(createProdutoSchema), ProdutoController.create);

router.put('/:id', verificarToken, validarIdNumerico, verificarAdmin, validate(updateProdutoSchema), ProdutoController.update);

router.delete('/:id', verificarToken, validarIdNumerico, verificarAdmin, ProdutoController.remove);

module.exports = router;
