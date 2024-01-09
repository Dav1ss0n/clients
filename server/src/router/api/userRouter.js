const express = require("express");
const { body, validateSchema } = require("express-validator");
const userController = require("../../controllers/userController.js");
const roleMiddleware = require("../../middlewares/roleMiddleware.js");
const assignmentMiddleware = require("../../middlewares/assignmentMiddleware.js");


const router = express.Router();



// router.use(multer().array());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));



router.get("/me", roleMiddleware(), userController.getUser);
router.get("/:userId", roleMiddleware(), userController.getUserById);
router.get("/", roleMiddleware(["Staff", "Head Staff"]), userController.getUsers);

router.post(
  "/", 
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('username').trim().isLength({ min: 3 }).withMessage('Username is required'),
  roleMiddleware(),
  assignmentMiddleware,
  userController.createUser
);

router.put(
  "/me", 
  body('username').optional().trim().isLength({ min: 3 }).withMessage('Username is required'),
  body('password').optional().trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  roleMiddleware(), 
  userController.updateUser
);
router.put(
  "/:userId", 
  body('username').optional().trim().isLength({ min: 3 }).withMessage('Username is required'),
  body('password').optional().trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  roleMiddleware(["Staff", "Head Staff"]), 
  assignmentMiddleware,
  userController.updateUserById
);

router.delete(
  "/me", 
  roleMiddleware(),
  userController.deleteUser
);
router.delete(
  "/:userId", 
  roleMiddleware(["Staff", "Business"]),
  userController.deleteUserById
);

  

module.exports = router;