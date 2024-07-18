const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validatuionErrors.isEmpty()) {
        const errors = {};
        validationErrors
            .array()
            .forEach(error => errors[errors.path] = error.msg);

        const err = Error('Bad request.');
        err.errors = errors;
        err.status = 400;
        err.title = 'Bad request';
        next(err);
    }
    next();
};



module.exports = { handleValidationErrors };