const validarIdNumerico = (req, res, next) => {
    if (!/^[0-9]+$/.test(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "ID de produto inválido."
        });
    }

    next();
};

module.exports = validarIdNumerico;