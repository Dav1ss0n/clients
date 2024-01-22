const express = require("express");
const { body } = require("express-validator");
const roleMiddleware = require("../..//middlewares/roleMiddleware");
const assignmentMiddleware = require("../..//middlewares/assignmentMiddleware");
const businessController = require("../../controllers/businessController");


const router = express.Router();



router.post(
  "/", 
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('username').trim().isLength({ min: 3 }).withMessage('Username is required'),
  assignmentMiddleware,
  businessController.createBusinessUser
);
router.post(
  '/me',
  businessController.createBusinessProfile    
);

router.get("/me", roleMiddleware(['Business']),  businessController.getBusiness);
router.get("/:accountId", roleMiddleware(['Staff', 'Head Staff']), businessController.getBusinessById);
router.get("/", businessController.getBusinesses);





module.exports = router;