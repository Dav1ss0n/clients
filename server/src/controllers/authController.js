const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const User = require('../models/userModel');
const tokenService = require("../services/tokenService");
const logger = require("../logger");

const authController = {};

// register a new user
authController.register = async (req, res) => {
    try {
        // validate user input using express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json({
                    errors: errors.array(),
                });
        }

        const {email, password, username, roles} = req.body;

        // check if user with same email or username already exists
        const existingUser = await User.findOne({$or: [{email}, {username}]});
        if (existingUser) {
            return res
                .status(422)
                .json({
                    message: 'Email or username already exists'
                });
        }

        // hash password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 12);

        // create new user in MongoDB database using Mongoose
        const newUser = new User({
            email,
            password: hashedPassword,
            username,
            roles
        });
        await newUser.save();

        // create and sign JWT token with secret key
        // const token = jwt.sign({userId: newUser._id, roles: ['User']}, process.env.JWT_SECRET, {expiresIn: '1y'});
        const token = tokenService.generateAccessToken(newUser._id, [roles]);

        // set JWT token as cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 365 * 24 * 60 * 60 * 1000 // 1 day in milliseconds
        });

        logger.info(`New user {${email}} was succesfully created`);
        return res
            .status(201)
            .json({
                message: 'User created successfully'
            });
    } catch (err) {
        logger.error("Error in registration system");
        return res
            .status(500)
            .json({
                message: 'Server error',
                ini: 'Registration system'
            });
    }
};

// log in an existing user
authController.login = async (req, res) => {
    try {
        // validate user input using express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json({
                    errors: errors.array()
                });
        }

        const {email, password} = req.body;

        // find user with matching email
        const user = await User.findOne({email});
        if (!user) {
            return res
                .status(401)
                .json({
                    message: 'Invalid email or password'
                });
        }

        // compare input password with hashed password in database using bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res
                .status(401)
                .json({
                    message: 'Invalid email or password'
                });
        }

        // create and sign JWT token with secret key
        // const token = jwt.sign({
        //     userId: user._id,
        //     roles: user.roles
        // }, process.env.JWT_SECRET, {
        //     expiresIn: '1y'
        // });
        const token = tokenService.generateAccessToken(user._id, user.roles);

        // set JWT token as cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 365 * 24 * 60 * 60 * 1000 // 1 day in milliseconds
        });

        logger.info(`User {${email}} has succesfully logged in`);
        return res.json({
            message: 'Login successful'
        });
    } catch (err) {
        logger.error("Error in login system");
        return res
            .status(500)
            .json({
                message: 'Server error',
                ini: "Login system"
            });
    }
};

// log out the current user
authController.logout = (req, res) => {
    try {
        // clear JWT token cookie
        res.clearCookie('token');

        // return success message
        return res.json({
            message: 'Logout successful'
        });
    } catch (err) {
        logger.error("Error in logout system");
        return res
            .status(500)
            .json({
                message: 'Server error',
                ini: 'Logout system'
            });
    }
};

// check if user is logged in
authController.isLoggedIn = async (req, res, next) => {
    try {
        // get JWT token from cookie
        const token = req.cookies.token;

        // if token is missing, return 401 Unauthorized
        if (!token) {
            return res
                .status(401)
                .json({
                    message: 'Not authenticated'
                });
        }

        // verify JWT token with secret key
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // find user with matching ID in database
        const user = await User.findById(decodedToken.userId);
        if (!user) {
            return res
                .status(401)
                .json({
                    message: 'Not authenticated'
                });
        }

        // set user ID on request object
        req.userId = user.id;

        // continue to next middleware
        next();
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({
                message: 'Server error',
                ini: 'isLoggedIn Middleware'
            });
    }
};

module.exports = authController;