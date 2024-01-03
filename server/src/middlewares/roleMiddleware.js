const jwt = require("jsonwebtoken"),
  secret = process.env.JWT_SECRET,
  responser = require("../responser.js");

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }

    try {
      if (!req.cookies || !req.cookies.token) {
        responser.Unauthorized(res, "");
      }
      const token = req.cookies.token;

      const { roles: userRoles } = jwt.verify(token, secret);

      if (roles.length) {
        // если переданы роли то проверяем что есть хотя бы одна из заданных
        const hasRole = userRoles.some((role) => roles.includes(role));

        if (!hasRole) {
          return res.status(403).json({ message: "Forbidden" });
        }
      } else {
        // если роли не заданы, проверяем что есть хотя бы одна роль
        if (!userRoles.length) {
          return res.status(403).json({ message: "Forbidden" });
        }
      }

      next();
    } catch (e) {
      console.error(e);
      responser.InternalServerError(res, "Role Middleware");
    }
  };
};
