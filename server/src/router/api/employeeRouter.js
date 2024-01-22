const express = require("express");
const {body} = require('express-validator');
const roleMiddleware = require('../../middlewares/roleMiddleware');
const employeeController = require("../../controllers/employeeController");



const router = express.Router();



// router.get("/me", employeeController.getEmployees);
// router.get("/:id", employeeController.getEmployeesById);
// router.get("/", employeeController.getEmployees);


  
module.exports = router;