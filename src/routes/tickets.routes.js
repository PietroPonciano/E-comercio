'use strict';

const express = require('express');
const router = express.Router();

const verificarToken = require('../middlewares/auth.middleware');
const { verificarSuporte } = require('../middlewares/role.middleware');
const validarIdNumerico = require('../utils/validarIdNumerico')

const TicketController = require('../controllers/ticket.controller');

// Listar tickets do próprio usuário autenticado
router.get('/my', verificarToken, TicketController.getMyTickets);

// Listar todos os tickets do sistema (Acesso restrito ao suporte)
router.get('/all', verificarToken, verificarSuporte, TicketController.getAllTickets);

// Detalhes completos de um ticket específico
router.get('/:id', verificarToken, validarIdNumerico, verificarSuporte, TicketController.getById);

// Criar um novo ticket
router.post('/', verificarToken, TicketController.create);

// Adicionar mensagem a um ticket existente
router.post('/:id/messages', verificarToken, validarIdNumerico, TicketController.addMessage);

// Suporte assume um ticket
router.post('/:id', verificarToken, verificarSuporte, validarIdNumerico, TicketController.assignTicket);

// Alterar o status do ticket (Acesso restrito ao suporte)
router.put('/:id/status', verificarToken, verificarSuporte, validarIdNumerico, TicketController.updateStatus);

// Excluir um ticket
router.delete('/:id', verificarToken, validarIdNumerico, TicketController.remove);

module.exports = router;