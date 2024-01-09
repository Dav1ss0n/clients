const bcrypt = require("bcrypt");
const { validationResult } = require('express-validator');
const logger = require("../utils/logger");
const User = require("../models/userModel");
const tokenService = require("../services/tokenService");
const responser = require("../utils/responser");

class UserController {

  async getUsers(req, res) {
    try {
      const users = await User.find().select('-password').exec();
      return res.json(users);
    } catch (error) {
      logger.error(new Error(error));
      return responser.InternalServerError(res, "~getUsers~ function");
      }
    }
    
    async getUserById(req, res) {
      try {
      const userId = req.params.userId;
      const user = await User.findOne({_id: userId}).select('-password').exec();
      if (!user) {
        return responser.NotFound(res, "~getUserById function");
      }
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

  async createUser(req, res) {
    try {
      const token = req.cookies.token;
      const iniUserId = tokenService.validateToken(token).userId;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return responser.BadRequest(res, "Request validator", errors.array());
      }

      const { email, username, password, role } = req.body;

      // check if user with same email or username already exists
      const existingUser = await User.findOne({email});
      if (existingUser) {
        return responser.Conflict(res, 'Request validator', `Email is already in use.`);
      }

      // hash password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 12);

      // create new user in MongoDB database using Mongoose
      const newUser = new User({
        email,
        password: hashedPassword,
        username,
        role
      });
      await newUser.save();

      logger.info(`A new user ${newUser._id} was created by ${iniUserId}`)
      return res.sendStatus(201);
    } catch (error) {
      logger.exitOnError(new Error(error));
      return responser.InternalServerError(res, "~createaUser~ function");
    }
  }

  async updateUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return responser.BadRequest(res, "Request validator", errors.array());
      }

      let updatedFields = req.body;
      if (!updatedFields.username && !updatedFields.password) {
        return responser.BadRequest(res, "Request validator", "No data was received");
      }

      if (updatedFields.password) {
        updatedFields.password = await bcrypt.hash(updatedFields.password, 12);
      }

      const token = req.cookies.token;
      const userId = tokenService.validateToken(token).userId;

      const user = await User.findOneAndUpdate({ _id: userId }, {$set: updatedFields});
      if (user) {
        const updatedUser = await User.findOne({ _id: userId}).select("-password").exec();
        logger.info(`{${userId}} has updated his profile`);
        return res.json(updatedUser);
      } else {
        return responser.NotFound(res, "User finder");
      }
    } catch (error) {
      logger.error(new Error(error));
      return responser.InternalServerError(res, "~updateUser~ function");
    }
  }

  async updateUserById(req, res) {
    try {
      const token = req.cookies.token;
      const iniUserId = tokenService.validateToken(token).userId;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return responser.BadRequest(res, "Invalid input", errors.array());
      }

      const userId = req.params.userId;
      if (!userId) {
        return responser.BadRequest(res, "Request validator", "No id was received");
      }

      // Checking the values of updated fields
      let updatedFields = req.body;
      if (!updatedFields.username && !updatedFields.password) {
        return responser.BadRequest(res, "Request validator", "No data was received");
      }
      // Checking the owner of this resource
      if (updatedFields.password) {
        updatedFields.password = await bcrypt.hash(updatedFields.password, 12);
      }
      
      const user = await User.findOneAndUpdate({ _id: userId }, {$set: updatedFields});
      if (!user) {
        return responser.NotFound(res, "User find and update")
      }

      const updatedUser = await User.findOne({ _id: userId}).select("-password").exec();
      logger.info(`User {${userId}} was updated by {${iniUserId}}`);
      return res.json(updatedUser);
    } catch (error) {
      // throw new Error(error);
      logger.error(new Error(error));
      return responser.InternalServerError(res, "~updateUserById~ function");
    }
  }

  async deleteUser(req, res) {
    try {
      const token = req.cookies.token;
      const userId = tokenService.validateToken(token).userId;

      const user = await User.findOneAndDelete({_id: userId});
      if (!user) {
        return responser.NotFound(res, "User find and delete");
      }

      res.clearCookie('token');
      logger.info(`User {${user.id}} has deleted himself`);
      return res.sendStatus(200);
    } catch (error) {
      logger.error(new Error(error));
      return responser.InternalServerError(res, "~deleteUser~ function");
    }
  }

  async deleteUserById(req, res) {
    try {
      const token = req.cookies.token;
      const iniUserId = tokenService.validateToken(token).userId;

      const userId = req.params.userId;
      if (!userId) {
        return responser.BadRequest(res, "Request validator", "No id was received");
      }

      const user = await User.findOneAndDelete({ _id: userId });
      if (!user) {
        return responser.NotFound(res, "User find and update")
      }

      logger.info(`User {${user._id}} was deleted by {${iniUserId}}`);
      return res.sendStatus(200);
    } catch (error) {
      logger.error(new Error(error));
      return responser.InternalServerError(res, "~deleteUser~ function");
    }
  }
}

module.exports = new UserController();