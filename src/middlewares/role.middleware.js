'use strict';

const { Usuario, Role } = require('../models');

const verificarRole = (rolesPermitidas) => async (req, res, next) => {
    try {
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({
                success: false,
                message: "Usuário não autenticado."
            });
        }

        const usuario = await Usuario.findByPk(req.usuario.id, {
            include: {
                model: Role,
                as: 'role',
                attributes: ['id', 'nome']
            }
        });

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: "Usuário não encontrado."
            });
        }

        const nomeRole = usuario.role && usuario.role.nome;

        if (!nomeRole || !rolesPermitidas.includes(nomeRole)) {
            return res.status(403).json({
                success: false,
                message: "Acesso negado. Permissão insuficiente."
            });
        }

        req.usuario.role = usuario.role;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro interno no servidor."
        });
    }
};

const verificarAdmin = verificarRole(['Adm']);
const verificarSuporte = verificarRole(['Adm', 'Atendente']);

module.exports = { verificarRole, verificarAdmin, verificarSuporte };
