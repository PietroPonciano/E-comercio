'use strict';

const express = require('express');
const router = express.Router();

const CompraController = require('../controllers/compra.controller');

router.post('/webhook', CompraController.webhook);

module.exports = router;
