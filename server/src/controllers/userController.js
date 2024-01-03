const bcrypt = require("bcrypt");
const { validationResult } = require('express-validator');
const logger = require("../logger");
const User = require("../models/userModel");
const tokenService = require("../services/tokenService");
const responser = require("../responser");

class UserController {

  async getUsers(req, res) {
    try {
      const users = await User.find().select('-password');
      return res.json(users);
    } catch (error) {
      logger.error(new Error(error));
      return responser.InternalServerError(res, "~getUsesr~ function");
      }
    }
    
    async getUserById(req, res) {
      try {
      const userId = req.params.userId;
      const user = await User.findOne({_id: userId}).select('-password').exec();
      return res.json(user);
    } catch (error) {
      logger.error(new Error(error));
      return responser.InternalServerError(res, "~getUserById~ function");
    }
  }
  
  async getUser(req, res) {
    try {
      // receiving user id and checking for its value
      const token = req.cookies.token;
      const userId = tokenService.validateToken(token).userId;

      const user = await User.findOne({_id: userId}).select('-password').exec();
      return res.json(user);
    } catch (error) {
      logger.error(new Error(error));
      return responser.InternalServerError(res, "~getUser~ function");
    }
  }

  async updateUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return responser.BadRequest(res, "Invalid input");
      }

      let updatedFields = req.body;
      if (!updatedFields.username && !updatedFields.password) {
        return responser.BadRequest(res, "Request validator")
      }

      if (updatedFields.password) {
        return updatedFields.password = await bcrypt.hash(updatedFields.password, 12);
      }

      const token = req.cookies.token;
      const userId = tokenService.validateToken(token).userId;

      const user = await User.findOneAndUpdate({ _id: userId }, {$set: updatedFields});
      if (user) {
        const updatedUser = await User.findOne({ _id: userId}).select("-password").exec();
        res.json(updatedUser);
      }
    } catch (error) {
      logger.error(new Error(error));
      return responser.InternalServerError(res, "~updateUser~ function");
    }
  }

  async updateUserById(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return responser.BadRequest(res, "Invalid input");
      }

      const userId = req.params.userId;
      if (!userId) {
        return responser.BadRequest(res, "Invalid input");
      }

      // Checking the values of updated fields
      let updatedFields = req.body;
      if (!updatedFields.username && !updatedFields.password) {
        return responser.BadRequest(res, "Request validator")
      }
      // Checking the owner of this resource
      if (updatedFields.password) {
        updatedFields.password = await bcrypt.hash(updatedFields.password, 12);
      }
      
      const user = await User.findOneAndUpdate({ _id: userId }, {$set: updatedFields});
      if (!user) {
        return responser.NotFound(res, "User find and update")
      }
      if (user) {
        const updatedUser = await User.findOne({ _id: userId}).select("-password").exec();
        res.json(updatedUser);
      }
    } catch (error) {
      // throw new Error(error);
      logger.error(new Error(error));
      return responser.InternalServerError(res, "~updateUserById~ function");
    }
  }
}

module.exports = new UserController();