const express = require("express");
const multer = require("multer");
const { body } = require("express-validator");
const roleMiddleware = require("../..//middlewares/roleMiddleware");
const businessController = require("../../controllers/businessController");


const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post(
  "/create",
  upload.single("logo"),
  [
    body("description").notEmpty().withMessage("Description is required"),
    body("category").notEmpty().withMessage("Category wasn't chosen"),
    body("location.address").notEmpty().withMessage("Address is required"),
    body("location.coordinates")
      .notEmpty()
      .withMessage("Coordinates are required"),
  ],
  roleMiddleware(["Business", "Staff", "Head Staff"]),
  businessController.create
);

router.post(
  "/edit",
  upload.single("logo"),
  [
    body("description").notEmpty().withMessage("Description is required"),
    body("category").notEmpty().withMessage("Category wasn't chosen"),
    body("location.address").notEmpty().withMessage("Address is required"),
    body("location.coordinates")
      .notEmpty()
      .withMessage("Coordinates are required"),
  ],
  roleMiddleware(["Business"]),
  businessController.edit
);

router.post(
  "/edit/@:email",
  upload.single("logo"),
  [
    body("description").notEmpty().withMessage("Description is required"),
    body("category").notEmpty().withMessage("Category wasn't chosen"),
    body("location.address").notEmpty().withMessage("Address is required"),
    body("location.coordinates")
      .notEmpty()
      .withMessage("Coordinates are required"),
  ],
  roleMiddleware(["Staff", "Head Staff"]),
  businessController.edit
);

router.delete(
  "/delete",
  roleMiddleware(["Business"]),
  businessController.delete
);

router.delete(
  "/delete/@:email",
  roleMiddleware(["Staff", "Head Staff"]),
  businessController.delete
);
router.use("/", (req, res) => {
  res.status(404).end("Not found");
});


module.exports = router;