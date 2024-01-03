const express = require("express");
const { body, validateSchema } = require("express-validator");
const userController = require("../../controllers/userController.js");
const roleMiddleware = require("../../middlewares/roleMiddleware.js");


const router = express.Router();



// router.use(multer().array());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));



router.get("/me", roleMiddleware([]), userController.getUser);
router.get("/:userId", roleMiddleware([]), userController.getUserById);
router.get("/", roleMiddleware(["Staff", "Head Staff"]), userController.getUsers);
router.put(
  "/me", 
  body('username').optional().trim().isLength({ min: 3 }).withMessage('Username is required'),
  body('password').optional().trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  roleMiddleware([]), 
  userController.updateUser
);
router.put(
  "/:userId", 
  body('username').optional().trim().isLength({ min: 3 }).withMessage('Username is required'),
  body('password').optional().trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  roleMiddleware(["Staff", "Head Staff"]), 
  userController.updateUserById
);


  
module.exports = router;