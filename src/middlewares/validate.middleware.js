'use strict';

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
        // Formata os erros para serem mais amigáveis
        const message = error.details.map(i => i.message).join(', ');
        return res.status(400).json({ success: false, message });
    }
    
    next();
};

module.exports = validate;