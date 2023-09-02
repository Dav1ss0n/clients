const 
    AuthError = require('../exceptions/authError'),
    validateToken = require('../services/tokenService').validateToken;

module.exports = function (req, res, next) {
    try {
        const response = validateToken(req.cookies.token);
        if (response.result === null) {
            return next(AuthError.UnauthorizedError());
        }

        next();
    } catch (e) {
        return next(AuthError.UnauthorizedError());
    }
};