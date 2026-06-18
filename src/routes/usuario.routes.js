'use strict';
const express = require('express');
const router = express.Router();

const verificarToken = require('../middlewares/auth.middleware');
const { verificarAdmin, verificarSuporte } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const UsuarioController = require('../controllers/usuario.controller');
const { updateProfileSchema, updateUserSchema } = require('../schemas/usuario.schema');

const validarIdNumerico = (req, res, next) => {
    if (!/^[0-9]+$/.test(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "ID de usuário inválido."
        });
    }

    next();
};

router.get('/profile', verificarToken, UsuarioController.getProfile);

router.put('/profile', verificarToken, validate(updateProfileSchema), UsuarioController.updateProfile);

router.get('/:id', verificarToken, validarIdNumerico, verificarSuporte, UsuarioController.getUserById);

router.put('/:id', verificarToken, validarIdNumerico, verificarAdmin, validate(updateUserSchema), UsuarioController.updateUserById);

module.exports = router;
