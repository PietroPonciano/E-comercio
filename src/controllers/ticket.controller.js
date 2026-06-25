'use strict';

const TicketService = require('../services/ticket.service');
const { createTicketSchema, createMensagemSchema, updateTicketStatusSchema } = require('../schemas/ticket.schema');

const respostaErro = (res, error) => {
    if (error.statusCode) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    return res.status(500).json({
        success: false,
        message: "Erro interno no servidor."
    });
};

const getMyTickets = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await TicketService.listarMeusTickets(req.usuario.id, { page, limit });

        return res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

const getAllTickets = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await TicketService.listarTodosTickets({ page, limit });

        return res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

const getById = async (req, res) => {
    try {
        const ticket = await TicketService.obterDetalhesTicket(req.params.id, req.usuario);

        return res.status(200).json({
            success: true,
            data: ticket
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

const getByIdComoCliente = async (req, res) => {
    try {
        // Passa o ID do ticket e o objeto do usuário vindo do token
        const ticket = await TicketService.obterDetalhesTicketComoCliente(req.params.id, req.usuario);

        return res.status(200).json({
            success: true,
            data: ticket
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

const create = async (req, res) => {
    try {
        const { error, value } = createTicketSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const ticket = await TicketService.criarTicket(value, req.usuario.id);

        return res.status(201).json({
            success: true,
            message: "Ticket criado com sucesso.",
            data: ticket
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

const addMessage = async (req, res) => {
    try {
        const { error, value } = createMensagemSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const mensagem = await TicketService.adicionarMensagem(req.params.id, value, req.usuario);

        return res.status(201).json({
            success: true,
            message: "Mensagem enviada com sucesso.",
            data: mensagem
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

const assignTicket = async (req, res) => {
    try {
        const ticket = await TicketService.assumirTicket(req.params.id, req.usuario.id);

        return res.status(200).json({
            success: true,
            message: "Ticket assumido com sucesso.",
            data: ticket
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

const updateStatus = async (req, res) => {
    try {
        const { error, value } = updateTicketStatusSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const ticket = await TicketService.alterarStatus(req.params.id, value.status);

        return res.status(200).json({
            success: true,
            message: "Status do ticket atualizado com sucesso.",
            data: ticket
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

const remove = async (req, res) => {
    try {
        await TicketService.excluirTicket(req.params.id, req.usuario);

        return res.status(200).json({
            success: true,
            message: "Ticket removido com sucesso."
        });
    } catch (error) {
        return respostaErro(res, error);
    }
};

module.exports = {
    getMyTickets,
    getAllTickets,
    getById,
    create,
    addMessage,
    assignTicket,
    updateStatus,
    remove,
    getByIdComoCliente
};