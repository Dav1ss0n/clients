const responser = require("../utils/responser");
const tokenService = require("../services/tokenService");
const Role = require("../models/roleModel");
const User = require("../models/userModel");



module.exports = async function (req, res, next) {
  const token = req.cookies.token;
  const userRole = tokenService.validateToken(token).role;
  const userRoleData = await Role.findOne({name: userRole});
  const userRoleLevel = userRoleData.level;

  const targetedUserId = req.params.userId;
  const targetedUser = await User.findOne({_id: targetedUserId});
  if (!targetedUser) {
    return responser.NotFound(res, "User find and update");
  }

  const targetedUserRole = targetedUser.role;
  const targetedUserData = await Role.findOne({name: targetedUserRole});
  const targetedUserLevel = targetedUserData.level;

  if (userRoleLevel < targetedUserLevel) {
    return res.status(403);
  }

  return next();
};
