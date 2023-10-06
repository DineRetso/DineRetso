const express = requires("express");
const dotenv = require("dotenv");

dotenv.config();
const paymentRouter = express.Router();

module.exports = paymentRouter;
