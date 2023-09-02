const AuthError = require('../exceptions/authError');

module.exports = function (err, req, res, next) {
    if (err instanceof AuthError) {
        return res.status(err.status).json({message: err.message, errors: err.init})
    }
    return res.status(500).json({error: 'Непредвиденная ошибка', message: err})

};