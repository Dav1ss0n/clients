const 
    jwt = require("jsonwebtoken"),
    secret = process.env.JWT_SECRET;

module.exports.generateAccessToken = (userId, roles) => {
    const payload = {
        userId,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "1y"} )
}

module.exports.validateToken = (token) => {
    try {
        const payload = jwt.verify(token, secret);
        return payload;
    } catch (e) {
        return null;
    }
}