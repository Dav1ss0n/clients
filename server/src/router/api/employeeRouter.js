const express = require("express");
const {body} = require('express-validator');
const roleMiddleware = require('../../middlewares/roleMiddleware');
const employeeController = require("../../controllers/employeeController");



const router = express.Router();



// router.use(multer().array());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));



router.post(
    '/add', 
    [
        body('name').isLength({min: 4}).withMessage('Name is required'),
        body("bio").isLength({min:4, max: 120})
    ],
    roleMiddleware(['Business']),
    employeeController.add
);

router.post(
    '/add/@:businessEmail', 
    [
        body('name').isLength({min: 4}).withMessage('Name is required'),
        body('email').isEmail().withMessage('Email is required'),
    ],
    roleMiddleware(['Staff', 'Head Staff']),
    employeeController.add
);

router.post(
    '/edit/@:clerkId', 
    [
        body('name').isLength({min: 4}).withMessage('Name is required'),
    ],
    roleMiddleware(['Business', 'Staff', 'Head Staff']),
    employeeController.edit
);

router.delete(
    '/delete/@:clerkId', 
    employeeController.delete
);

router.use("/", (req, res) => {
    res.status(404).end("Not found");
  });


  
module.exports = router;