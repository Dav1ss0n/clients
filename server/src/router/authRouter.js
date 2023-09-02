const express = require("express");
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const multer = require('multer');
const accessMiddleware = require("../middlewares/operatorMiddleware");



const router = express.Router();



router.use(multer().array());



// registration route
router.post(
    '/register',
    body('email')
        .isEmail()
        .withMessage('Invalid email address'),
    body('password')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('username')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Username is required'),
    accessMiddleware,
    authController.register
  );
  
  // login route
  router.post(
    '/login',
    [
      body('email').isEmail().withMessage('Invalid email address'),
      body('password').trim().isLength({min: 6}).withMessage('Password must be longer than 6 characters'),
    ],
    authController.login
  );
  
  // logout route
  router.post('/logout', authController.logout);



module.exports = router