const tokenService = require("../services/tokenService.js");
const Role = require("../models/roleModel.js");
const responser = require("../utils/responser.js");
const logger = require("../utils/logger.js");



module.exports =  function (roles) {
  return async function (req, res, next) {
    try {
      if (!req.cookies || !req.cookies.token) {
        return responser.Unauthorized(res, "Role Middleware");
      }
      const token = req.cookies.token;
      const userRole = tokenService.validateToken(token).role;
      
      if (roles) {
        // роли переданы
        const allowedRoles = await Role.find({name: {$in: roles}});
        const roleNames = allowedRoles.map(r => r.name);
        
        if (roleNames.includes(userRole)) {
          return next();
        } else {
          return res.sendStatus(403);
        }
      } else {
        // роли не переданы
        const allRoles = await Role.find({});
        const roleNames = allRoles.map(r => r.name);
        
        // Проверяем, что роли пользователя есть в базе
        if (roleNames.includes(userRole)) {
          return next();
        } else {
          return res.sendStatus(403);
        }
      }
    } catch (error) {
      logger.error(new Error(error));
      responser.InternalServerError(res, "Role Middleware");
    }
  };
};
