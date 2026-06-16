'use strict';
const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate.middleware')
const AuthController = require('../controllers/auth.controller')

const { registerSchema, loginSchema } = require('../schemas/auth.schema');

router.post('/register', validate(registerSchema), AuthController.register);

router.post('/login', validate(loginSchema), AuthController.login);

router.post('/forgot-password', (req, res) => {
    res.status(200).json({ success: true, message: "Simbólico: E-mail de recuperação enviado." });
});

module.exports = router;