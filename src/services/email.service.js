'use strict';

const enviarEmail = async ({ to, subject, html }) => {
    if (!process.env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY não configurada.');
    }

    const from = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ from, to, subject, html })
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Erro ao enviar e-mail pelo Resend: ${errorBody}`);
    }
};

const enviarCodigoResetSenha = async ({ to, nome, codigo }) => {
    await enviarEmail({
        to,
        subject: 'Código para redefinir sua senha',
        html: `
            <p>Olá${nome ? `, ${nome}` : ''}.</p>
            <p>Seu código para redefinir a senha é:</p>
            <h2>${codigo}</h2>
            <p>Esse código expira em 15 minutos.</p>
            <p>Se você não solicitou essa alteração, ignore este e-mail.</p>
        `
    });
};

const enviarCodigoVerificacaoEmail = async ({ to, nome, codigo }) => {
    await enviarEmail({
        to,
        subject: 'Código para verificar seu e-mail',
        html: `
            <p>Olá${nome ? `, ${nome}` : ''}.</p>
            <p>Seu código para verificar a conta é:</p>
            <h2>${codigo}</h2>
            <p>Esse código expira em 15 minutos.</p>
            <p>Se você não criou essa conta, ignore este e-mail.</p>
        `
    });
};

module.exports = { enviarCodigoResetSenha, enviarCodigoVerificacaoEmail };
