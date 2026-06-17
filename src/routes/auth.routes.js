'use strict';
const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate.middleware')
const AuthController = require('../controllers/auth.controller')

const {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    verifyEmailSchema,
    resendVerificationCodeSchema
} = require('../schemas/auth.schema');

router.post('/register', validate(registerSchema), AuthController.register);

router.post('/login', validate(loginSchema), AuthController.login);

router.post('/verify-email', validate(verifyEmailSchema), AuthController.verifyEmail);

router.post('/resend-verification-code', validate(resendVerificationCodeSchema), AuthController.resendVerificationCode);

router.post('/forgot-password', validate(forgotPasswordSchema), AuthController.forgotPassword);

router.post('/reset-password', validate(resetPasswordSchema), AuthController.resetPassword);

module.exports = router;
