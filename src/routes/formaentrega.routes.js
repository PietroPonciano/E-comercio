'use strict';

const express = require('express');
const router = express.Router();

const FormaEntregaController = require('../controllers/formaentrega.controller');

router.get('/', FormaEntregaController.list);

module.exports = router;
