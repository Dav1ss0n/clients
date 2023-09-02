const express = require("express");
const multer = require("multer");
const {body} = require('express-validator');
const roleMiddleware = require('../..//middlewares/roleMiddleware');
const clerkController = require("../../controllers/clerkController");



const router = express.Router();



// router.use(multer().array());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));



const storage = multer.memoryStorage();
const upload = multer({ storage });



router.post(
    '/add', 
    upload.single(),
    [
        body('name').isLength({min: 4}).withMessage('Name is required'),
        body("bio").isLength({min:4, max: 120})
    ],
    roleMiddleware(['Business']),
    clerkController.add
);

router.post(
    '/add/@:businessEmail', 
    upload.single(),
    [
        body('name').isLength({min: 4}).withMessage('Name is required'),
        body('email').isEmail().withMessage('Email is required'),
    ],
    roleMiddleware(['Staff', 'Head Staff']),
    clerkController.add
);

router.post(
    '/edit/@:clerkId', 
    upload.single(),
    [
        body('name').isLength({min: 4}).withMessage('Name is required'),
    ],
    roleMiddleware(['Business', 'Staff', 'Head Staff']),
    clerkController.edit
);

router.delete(
    '/delete/@:clerkId', 
    clerkController.delete
);

router.use("/", (req, res) => {
    res.status(404).end("Not found");
  });


  
module.exports = router;