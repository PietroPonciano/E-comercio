'use strict';

const { Ticket, Mensagem, Usuario, sequelize } = require('../models');

// Funções Privadas Obrigatórias
const criarErro = (message, statusCode = 400) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const buscarTicketOuFalhar = async (id) => {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
        throw criarErro("Ticket não encontrado.", 404);
    }
    return ticket;
};


const formatarUsuario = (usuario) => {
    if (!usuario) return null;
    return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
    };
};

const formatarMensagem = (mensagem) => {
    if (!mensagem) return null;
    const msgJson = mensagem.toJSON ? mensagem.toJSON() : mensagem;
    return {
        id: msgJson.id,
        mensagem: msgJson.mensagem,
        imagem_url: msgJson.imagem_url,
        createdAt: msgJson.createdAt,
        autor: formatarUsuario(msgJson.autor)
    };
};

const formatarTicket = (ticket) => {
    if (!ticket) return null;
    const ticketJson = ticket.toJSON ? ticket.toJSON() : ticket;

    let quantidade_mensagens = 0;
    if (ticketJson.mensagens) {
        quantidade_mensagens = ticketJson.mensagens.length;
    } else if (ticketJson.quantidade_mensagens !== undefined) {
        quantidade_mensagens = parseInt(ticketJson.quantidade_mensagens, 10) || 0;
    }

    return {
        id: ticketJson.id,
        titulo: ticketJson.titulo,
        status: ticketJson.status,
        data_inicializacao: ticketJson.data_inicializacao,
        data_finalizacao: ticketJson.data_finalizacao,
        createdAt: ticketJson.createdAt,
        cliente: formatarUsuario(ticketJson.cliente),
        atendente: formatarUsuario(ticketJson.atendente),
        quantidade_mensagens
    };
};

// Funções de Negócio Públicas
const listarMeusTickets = async (usuarioId, { page = 1, limit = 10 }) => {
    const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const pageNumber = Math.max(Number(page) || 1, 1);
    const offset = (pageNumber - 1) * limitNumber;

    const { count, rows } = await Ticket.findAndCountAll({
        where: { usuario_id: usuarioId },
        attributes: [
            'id', 'titulo', 'status', 'data_inicializacao', 'data_finalizacao', 'createdAt',
            [
                sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM Mensagens AS m
                    WHERE m.ticket_id = Ticket.id
                )`),
                'quantidade_mensagens'
            ]
        ],
        include: [
            
            { model: Usuario, as: 'cliente', attributes: ['id', 'nome', 'email'] },
            
            
            { model: Usuario, as: 'atendente', attributes: ['id', 'nome', 'email'] }
        ],
        limit: limitNumber,
        offset,
        order: [['createdAt', 'DESC']]
    });

    return {
        data: rows.map(formatarTicket),
        pagination: {
            page: pageNumber,
            limit: limitNumber,
            total: count,
            pages: Math.ceil(count / limitNumber)
        }
    };
};

const listarTodosTickets = async ({ page = 1, limit = 10 }) => {
    const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const pageNumber = Math.max(Number(page) || 1, 1);
    const offset = (pageNumber - 1) * limitNumber;

    const { count, rows } = await Ticket.findAndCountAll({
        attributes: [
            'id', 'titulo', 'status', 'data_inicializacao', 'data_finalizacao', 'createdAt',
            [
                sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM Mensagens AS m
                    WHERE m.ticket_id = Ticket.id
                )`),
                'quantidade_mensagens'
            ]
        ],
        include: [
            { model: Usuario, as: 'cliente', attributes: ['id', 'nome', 'email'] },
            { model: Usuario, as: 'atendente', attributes: ['id', 'nome', 'email'] }
        ],
        limit: limitNumber,
        offset,
        order: [['createdAt', 'DESC']]
    });

    return {
        data: rows.map(formatarTicket),
        pagination: {
            page: pageNumber,
            limit: limitNumber,
            total: count,
            pages: Math.ceil(count / limitNumber)
        }
    };
};

const obterDetalhesTicket = async (id, usuario) => {
    const ticket = await Ticket.findByPk(id, {
        include: [
            { model: Usuario, as: 'cliente', attributes: ['id', 'nome', 'email'] },
            { model: Usuario, as: 'atendente', attributes: ['id', 'nome', 'email'] },
            {
                model: Mensagem,
                as: 'mensagens',
                attributes: ['id', 'mensagem', 'imagem_url', 'createdAt'],
                include: [{ model: Usuario, as: 'autor', attributes: ['id', 'nome', 'email'] }]
            }
        ],
        order: [[{ model: Mensagem, as: 'mensagens' }, 'createdAt', 'ASC']]
    });

    if (!ticket) {
        throw criarErro("Ticket não encontrado.", 404);
    }

    

    const ticketJson = ticket.toJSON();
    return {
        id: ticketJson.id,
        titulo: ticketJson.titulo,
        status: ticketJson.status,
        data_inicializacao: ticketJson.data_inicializacao,
        data_finalizacao: ticketJson.data_finalizacao,
        createdAt: ticketJson.createdAt,
        cliente: formatarUsuario(ticketJson.cliente),
        atendente: formatarUsuario(ticketJson.atendente),
        mensagens: ticketJson.mensagens.map(formatarMensagem),
        quantidade_mensagens: ticketJson.mensagens.length
    };
};

const criarTicket = async (value, usuarioId) => {
    const ticket = await Ticket.create({
        titulo: value.titulo,
        status: 'aberto',
        usuario_id: usuarioId,
        atendente_id: null,
        data_inicializacao: new Date()
    });

    const ticketCriado = await Ticket.findByPk(ticket.id, {
        include: [
            { model: Usuario, as: 'cliente', attributes: ['id', 'nome', 'email'] }
        ]
    });

    return formatarTicket(ticketCriado);
};

const adicionarMensagem = async (ticketId, value, usuario) => {
    // 1. Busca o ticket ou falha com 404 se não existir
    const ticket = await buscarTicketOuFalhar(ticketId);

    // 2. Valida se o ticket não está fechado
    if (ticket.status === 'fechado') {
        throw criarErro("Não é possível adicionar mensagens a um ticket fechado.", 400);
    }

    // 3. Regra de Negócio: O autor deve ser o dono do ticket OU o atendente que o assumiu
    const ehDonoDoTicket = ticket.usuario_id === usuario.id;
    const ehAtendenteDoTicket = ticket.atendente_id === usuario.id;

    if (!ehDonoDoTicket && !ehAtendenteDoTicket) {
        throw criarErro("Acesso negado. Apenas o criador do ticket ou o suporte responsável podem enviar mensagens.", 403);
    }

    // 4. Criação da mensagem se passar nas validações
    const mensagem = await Mensagem.create({
        mensagem: value.mensagem,
        imagem_url: value.imagem_url,
        ticket_id: ticketId,
        usuario_id: usuario.id
    });

    // 5. Busca a mensagem criada incluindo os dados do autor formatados
    const mensagemCriada = await Mensagem.findByPk(mensagem.id, {
        include: [{ model: Usuario, as: 'autor', attributes: ['id', 'nome', 'email'] }]
    });

    return formatarMensagem(mensagemCriada);
};

const assumirTicket = async (ticketId, atendenteId) => {
    const ticket = await buscarTicketOuFalhar(ticketId);

    if (ticket.status !== 'aberto' || ticket.atendente_id !== null) {
        throw criarErro("Ticket já possui atendente.", 400);
    }

    await ticket.update({
        atendente_id: atendenteId,
        status: 'em_atendimento'
    });

    const ticketAtualizado = await Ticket.findByPk(ticketId, {
        include: [
            { model: Usuario, as: 'cliente', attributes: ['id', 'nome', 'email'] },
            { model: Usuario, as: 'atendente', attributes: ['id', 'nome', 'email'] }
        ]
    });

    return formatarTicket(ticketAtualizado);
};

const alterarStatus = async (ticketId, novoStatus) => {
    const ticket = await buscarTicketOuFalhar(ticketId);

    if (ticket.status === novoStatus) {
        throw criarErro(`O ticket já possui o status ${novoStatus}.`, 400);
    }

    const camposAtualizados = { status: novoStatus };

    if (novoStatus === 'fechado') {
        camposAtualizados.data_finalizacao = new Date();
    } else if (novoStatus === 'aberto') {
        camposAtualizados.data_finalizacao = null;
    }

    await ticket.update(camposAtualizados);

    const ticketAtualizado = await Ticket.findByPk(ticketId, {
        include: [
            { model: Usuario, as: 'cliente', attributes: ['id', 'nome', 'email'] },
            { model: Usuario, as: 'atendente', attributes: ['id', 'nome', 'email'] }
        ]
    });

    return formatarTicket(ticketAtualizado);
};

const excluirTicket = async (ticketId, usuario) => {
    const ticket = await buscarTicketOuFalhar(ticketId);

    if (usuario.role !== 'suporte') {
        if (ticket.usuario_id !== usuario.id) {
            throw criarErro("Acesso negado.", 403);
        }
        if (ticket.status !== 'aberto') {
            throw criarErro("Usuários comuns só podem excluir tickets abertos.", 400);
        }
    }

    await sequelize.transaction(async (t) => {
        await Mensagem.destroy({
            where: { ticket_id: ticketId },
            transaction: t
        });

        await ticket.destroy({
            transaction: t
        });
    });
};

const obterDetalhesTicketComoCliente = async (id, usuario) => {
    const ticket = await Ticket.findByPk(id, {
        include: [
            { model: Usuario, as: 'cliente', attributes: ['id', 'nome', 'email'] },
            { model: Usuario, as: 'atendente', attributes: ['id', 'nome', 'email'] },
            {
                model: Mensagem,
                as: 'mensagens',
                attributes: ['id', 'mensagem', 'imagem_url', 'createdAt'],
                include: [{ model: Usuario, as: 'autor', attributes: ['id', 'nome', 'email'] }]
            }
        ],
        order: [[{ model: Mensagem, as: 'mensagens' }, 'createdAt', 'ASC']]
    });

    
    if (!ticket) {
        throw criarErro("Ticket não encontrado.", 404);
    }

    
    if (ticket.usuario_id !== usuario.id) {
        throw criarErro("Acesso negado. Você não tem permissão para ver este ticket.", 403);
    }

  
    const ticketJson = ticket.toJSON();
    return {
        id: ticketJson.id,
        titulo: ticketJson.titulo,
        status: ticketJson.status,
        data_inicializacao: ticketJson.data_inicializacao,
        data_finalizacao: ticketJson.data_finalizacao,
        createdAt: ticketJson.createdAt,
        cliente: formatarUsuario(ticketJson.cliente),
        atendente: formatarUsuario(ticketJson.atendente),
        mensagens: ticketJson.mensagens.map(formatarMensagem),
        quantidade_mensagens: ticketJson.mensagens.length
    };
};

module.exports = {
    listarMeusTickets,
    listarTodosTickets,
    obterDetalhesTicket,
    criarTicket,
    adicionarMensagem,
    assumirTicket,
    alterarStatus,
    excluirTicket,
    obterDetalhesTicketComoCliente
};