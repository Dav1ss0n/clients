const logger = require("../logger");
const User = require("../models/userModel");
const tokenService = require("../services/tokenService");

class UserController {
  
  async getUsers(req, res) {
    try {
      const users = await User.find().select('-password');
      return res.status(200).json({users});
    } catch (error) {
      logger.error(new Error(error));
      return res
      .status(500)
      .json({
          status: "error",
          message: "Internal Server Error",
          ini: "~getUsers~ function"
        });
      }
    }
    
    async getUserById(req, res) {
      try {
      const userId = req.params.userId;
      const user = await User.findOne({_id: userId}).select('-password').exec();
      return res.status(200).json({user});
    } catch (error) {
      logger.error(new Error(error));
      return res
      .status(500)
      .json({
        status: "error",
        message: "Internal Server Error",
        ini: "~getUsers~ function"
      });
    }
  }
  
  async getUser(req, res) {
    try {
      // receiving user id and checking for its value
      const token = req.cookies.token;
      const userId = tokenService.validateToken(token).userId;

      const user = await User.findOne({_id: userId}).select('-password').exec();
      return res.json({user});
    } catch (error) {
      logger.error(new Error(error));
      return res
        .status(500)
        .json({
            message: 'Internal server error',
            ini: 'User data receiving system'
        });
    }
  }

  async updateUser(req, res) {
    try {
      
    } catch (error) {
      
    }
  }
}

module.exports = new UserController();