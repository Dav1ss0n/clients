const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const User = require('../models/userModel');
const tokenService = require("../services/tokenService");
const logger = require("../utils/logger");
const responser = require("../utils/responser");



class AuthController {
    async register(req, res) {
        try {
            // validate user input using express-validator
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return responser.BadRequest(res, "Request validator", errors.array());
            }
    
            const { email, password, username } = req.body;
    
            // check if user with same email or username already exists
            const existingUser = await User.findOne({email});
            if (existingUser) {
                return responser.Conflict(res, "Request validator", `Email is already in use`);
            }
    
            // hash password using bcrypt
            const hashedPassword = await bcrypt.hash(password, 12);
    
            // create new user in MongoDB database using Mongoose
            const newUser = new User({
                email,
                password: hashedPassword,
                username
            });
            await newUser.save();
    
            // create and sign JWT token with secret key
            // const token = jwt.sign({userId: newUser._id, roles: ['User']}, process.env.JWT_SECRET, {expiresIn: '1y'});
            const token = tokenService.generateAccessToken(newUser._id, 'User');
    
            // set JWT token as cookie
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 365 * 24 * 60 * 60 * 1000 // 1 day in milliseconds
            });
    
            // send response to the client
            logger.info(`A new user {${newUser._id}} was registered`)
            return res.sendStatus(201);
        } catch (err) {
            logger.error(new Error(err));
            return responser.InternalServerError(res, "~register~ function");
        }
    }

    async login(req, res) {
        try {
            // validate user input using express-validator
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return responser.BadRequest(res, 'Request validator', errors.array());
            }
    
            // call the private method to handle authentication logic
            const {email, password} = req.body;
    
            // find user with matching email
            const user = await User.findOne({email});
            if (!user) {
                return responser.Conflict(res, "Email matcher", "Invalid email address");
            }
    
            // compare input password with hashed password in database using bcrypt
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return responser.Conflict(res, "Password matcher", "Invalid password");
            }

            console.log(user.roles);

            // create jwt payload
            const token = tokenService.generateAccessToken(user._id, user.role);
    
            // set JWT token as cookie
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 365 * 24 * 60 * 60 * 1000 // 1 day in milliseconds
            });
    
            // send response with user data and access token
            logger.info(`User {${user._id}} has succesfully logged in`);
            return res.sendStatus(201);
        } catch (err) {
            logger.error("Error in login system");
            return res
                .status(500)
                .json({
                    message: 'Server error',
                    ini: "Login system"
                });
        }
    }
    
    async logout(req, res) {
        try {
            const token = req.cookies.token;
            const userId = tokenService.validateToken(token).userId;

            // clear JWT token cookie
            res.clearCookie('token');
    
            // return success message
            logger.info(`Logged out from account ${userId}`);
            return res.sendStatus(200);
        } catch (error) {
            logger.error(new Error(error));
            return res
                .status(500)
                .json({
                    message: 'Server error',
                    ini: 'Logout system'
                });
        }
    }
}



module.exports = new AuthController();