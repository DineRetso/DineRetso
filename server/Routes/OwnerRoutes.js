const express = require("express");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const RegRestaurants = require("../Models/Register_Model.js");
const Restaurant = require("../Models/Restaurant_Model.js");
const User = require("../Models/User_Model.js");
const { isAuth, isOwner } = require("../utils.js");

dotenv.config();
const ownerRouter = express.Router();

ownerRouter.get(
  "/restaurant/:owner/:restaurantID",
  isAuth,
  isOwner,
  expressAsyncHandler(async (req, res) => {
    const { owner, restaurantID } = req.params;
    try {
      const myRestaurant = await Restaurant.findById(restaurantID);

      if (myRestaurant) {
        res.send(myRestaurant);
      } else {
        return res.status(404).send({ message: "No restaurant found!" });
      }
    } catch (error) {
      return res.status(500).send({ message: "Internal server error" });
    }
  })
);

module.exports = ownerRouter;
