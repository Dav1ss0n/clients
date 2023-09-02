const express = require("express");
const businessRouter = require("./api/businessRouter");
const clerkRouter = require("./api/clerkRouter");



const router = express.Router();



router.use('/business', businessRouter);
router.use('/clerk', clerkRouter);
router.use("/", (req, res) => {
  res.status(404).end("Not found");
});


module.exports = router