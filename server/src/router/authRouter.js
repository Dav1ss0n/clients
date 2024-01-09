const express = require("express");
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const roleMiddleware = require("../middlewares/roleMiddleware");



const router = express.Router();



// registration route
router.post(
    '/register',
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('username').trim().isLength({ min: 3 }).withMessage('Username is required'),
    authController.register
);

// login route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').trim().isLength({min: 1}).withMessage('Password must contain something'),
  ],
  authController.login
);

// logout route
router.post(
  '/logout',
  roleMiddleware([]),
  authController.logout
);



module.exports = router