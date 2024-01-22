const responser = require("../utils/responser");
const tokenService = require("../services/tokenService");
const Role = require("../models/roleModel");
const User = require("../models/userModel");



module.exports = async function (req, res, next) {
  if (req.cookies.token) {
    const token = req.cookies.token;
    const userRole = tokenService.validateToken(token).role;
    const userRoleData = await Role.findOne({name: userRole});
    const userRoleLevel = userRoleData.level;


    let targetedUserLevel;

    if (req.params.userId) {
      const targetedUserId = req.params.userId;
      const targetedUser = await User.findOne({_id: targetedUserId});
      if (!targetedUser) {
        return responser.NotFound(res);
      }
    
      const targetedUserRole = targetedUser.role;
      const targetedUserData = await Role.findOne({name: targetedUserRole});
      targetedUserLevel = targetedUserData.level;
    } else if (req.body.role) {
  
      const targetedRoleData = await Role.findOne({name: targetedRole});
      if (!targetedRoleData) {
        return responser.BadRequest(res, "Request validator", "Invalid role");
      }
  
      targetedUserLevel = targetedRoleData.level;
    } else {
      return responser.BadRequest(res, "Request validator", "Invalid input");
    }
    
  
    if (userRoleLevel <= targetedUserLevel) {
      return res.sendStatus(403);
    }
  
    return next();
  } else {
    if (!req.body.role) {
      return responser.Unauthorized(res);
    }

    const targetedRole = req.body.role;
    if (targetedRole === 'Business' || targetedRole === 'Employee') {
      return next();
    } else {
      return responser.BadRequest(res, "Request validator", "Invalid role");
    }
  }

};
