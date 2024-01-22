const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const tokenService = require("../services/tokenService");
const User = require("../models/userModel");
const Business = require("../models/businessModel");
const logger = require("../utils/logger");
const responser = require("../utils/responser");



class BusinessController {
  
  async createBusinessUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return responser.BadRequest(res, "Request validator", errors.array());
      }

      const { email, username, password, role } = req.body;

      // check if user with same email or username already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return responser.Conflict(
          res,
          "Request validator",
          `Email is already in use`
        );
      }

      // hash password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 12);

      // create new user in MongoDB database using Mongoose
      const newUser = new User({
        email,
        password: hashedPassword,
        username,
        role,
      });
      await newUser.save();

      // create and sign JWT token with secret key
      const token = tokenService.generateAccessToken(newUser._id, "Business");

      // set JWT token as cookie
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
      });

      // send response to the client
      logger.info(`A new business user {${newUser._id}} was registered`);
      return res.sendStatus(201);
    } catch (error) {
      logger.error(new Error(error));
      return responser.InternalServerError(
        res,
        "~createBusinessUser~ function"
      );
    }
  }

  async createBusinessProfile(req, res) {
    try {
      
    } catch (error) {
      logger.error(new Error(error));
      return responser.InternalServerError(
        res,
        "~createBusinessProfile~ function"
      );
    }
  }
  async getBusiness(req, res) {
    try {
      // receiving user id and checking for its value
      const token = req.cookies.token;
      const accountId = tokenService.validateToken(token).userId;

      const account = await User.findOne({_id: accountId}).select('-password').exec();
      const profile = await Business.findOne({ownerId: accountId});
      return res.json({
        account,
        profile
      });
    } catch (error) {
      logger.error(new Error(error));
      return responser.InternalServerError(
        res,
        "~createBusinessProfile~ function"
      );
    }
  }

  async getBusinessById(req, res) {
    try {
      const accountId = req.params.accountId;
      const account = await User.findOne({_id: accountId}).select('-password').exec();
      if (!account) {
        return responser.NotFound(res);
      } else if (account.role !== "Business") {
        return responser.BadRequest(res, undefined, "Invalid user");
      }

      const profile = await Business.findOne({ownerId: accountId});
      return res.json({
        account,
        profile
      });
    } catch (error) {
      logger.error(new Error(error));
      return responser.InternalServerError(
        res,
        "~createBusinessProfile~ function"
      );
    }
  }

  async getBusinesses(req, res) {
    try {
      const accounts = await User.find({role: "Business"}).select('-password').exec();

      const businesses = [];
      for (let account of accounts) {
        let profile = await Business.findOne({ownerId: account._id});
        
        businesses.push({
          ...account._doc,
            profile: profile ? profile : null
        });
      }

      return res.json(businesses);
    } catch (error) {
      logger.error(new Error(error));
      return responser.InternalServerError(
        res,
        "~createBusinessProfile~ function"
      );
    }
  }
}

module.exports = new BusinessController();