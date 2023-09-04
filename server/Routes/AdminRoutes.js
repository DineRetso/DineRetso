const express = require("express");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const RegRestaurants = require("../Models/Register_Model.js");
const Restaurant = require("../Models/Restaurant_Model.js");
const User = require("../Models/User_Model.js");
const { isAuth, isAdmin } = require("../utils.js");

dotenv.config();
const adminRouter = express.Router();

adminRouter.get(
  "/pendingResto",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const pendingResto = await RegRestaurants.find({
      isConfirmed: "NotConfirmed",
    });
    if (pendingResto.length > 0) {
      res.send(pendingResto);
    } else {
      res.status(401).send({ message: "No Pending Restaurants!" });
    }
  })
);

adminRouter.get(
  "/pendingRestoInfo/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    const pendingResto = await RegRestaurants.findById(id);
    try {
      if (pendingResto) {
        res.send(pendingResto);
      } else {
        res.status(200).send({ message: "No restaurant found!" });
      }
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error!" });
    }
  })
);

adminRouter.post(
  "/cancelRegistration",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { _id } = req.body;
    try {
      const pendingResto = await RegRestaurants.findOne({ _id });
      if (!pendingResto) {
        return res
          .status(404)
          .json({ message: "Restaurant Registration not found!" });
      }
      pendingResto.reasonCancelled = req.body.reasonCancelled;
      pendingResto.isConfirmed = "Cancelled";
      await pendingResto.save();
      res.status(201).json({ message: "Restaurant cancellation success!" });
    } catch (error) {
      res.status(500).json({ message: "Restaurant Cancellation Failed!" });
    }
  })
);

adminRouter.post(
  "/confirmRegistration",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { _id, email } = req.body;
    try {
      const resto = await RegRestaurants.findOne({ _id });
      if (!resto) {
        return res
          .status(404)
          .json({ message: "No specific pending restaurant found!" });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "Restaurant have no owner! Please Delete!" });
      }
      const newResto = new Restaurant({
        profileImage: resto.image,
        resName: resto.resName,
        owner: resto.owner,
        email: resto.email,
        phoneNo: resto.phoneNo,
        address: resto.address,
        category: resto.category,
      });
      //update user info
      await newResto.save();

      user.myRestaurant = newResto._id;
      user.isOwner = true;
      await user.save();
      //update restaurant registration
      resto.isConfirmed = "Confirmed";
      await resto.save();
      res
        .status(201)
        .json({ message: "Restaurant has been saved to directory!" });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Error accepting restaurant!" });
    }
  })
);

adminRouter.get(
  "/getRestaurants",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const Resto = await Restaurant.find();
    try {
      if (Resto) {
        res.send(Resto);
      } else {
        res.status(401).send({ message: "No restaurant found!" });
      }
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error!" });
    }
  })
);
module.exports = adminRouter;
