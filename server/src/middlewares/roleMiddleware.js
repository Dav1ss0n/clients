const 
    jwt = require('jsonwebtoken'),
    secret = process.env.JWT_SECRET;


module.exports = function (roles) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }

        try {
            const token = req.cookies.token;
            if (!token) {
                return res
                    .status(401)
                    .json({
                        message: 'Unauthorized'
                    });
            }
            
            const {roles: userRoles} = jwt.verify(token, secret);
            let hasRole = false
            userRoles.forEach(userRole => {
                if (roles.includes(userRole)) {
                    hasRole = true
                }
            });
            
            if (!hasRole) {
                return res
                    .status(403)
                    .json({
                        message: 'Forbidden'
                    });
            }
            next();
        } catch (e) {
            console.error(e);
            return res
                .status(500)
                .json({
                    message: 'Server error',
                    ini: 'Role Middleware'
                });
        }
    }
};