const express = require("express");
const businessRouter = require("./api/businessRouter");
const employeeRouter = require("./api/employeeRouter");
const userRouter = require("./api/userRouter");



const router = express.Router();



router.use('/users', userRouter);
router.use('/businesses', businessRouter);
router.use('/employees', employeeRouter);
router.use("/", (req, res) => {
  res.status(404).end("Not found");
});


module.exports = router