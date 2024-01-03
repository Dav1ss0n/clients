const express = require("express");
const userController = require("../../controllers/userController.js");
const roleMiddleware = require("../../middlewares/roleMiddleware.js");


const router = express.Router();



// router.use(multer().array());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));



router.get("/me", roleMiddleware([]), userController.getUser);
router.get("/:userId", roleMiddleware([]), userController.getUserById);
router.get("/", roleMiddleware(["Staff", "Head Staff"]), userController.getUsers);
router.put("/:userId", userController.updateUser);


  
module.exports = router;