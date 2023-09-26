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
const resRouter = express.Router();

resRouter.get(
  "/getRestaurants",
  expressAsyncHandler(async (req, res) => {
    try {
      const restaurant = await Restaurant.find().select("-email");
      if (!restaurant) {
        return res.status(401).json("No Restaurants Available");
      } else {
        res.json(restaurant);
      }
    } catch (error) {
      res.status(500).send({ message: "Server Error!" });
    }
  })
);
resRouter.get(
  "/getFeaturedResto",
  expressAsyncHandler(async (req, res) => {
    try {
      const restaurant = await Restaurant.find({ isSubscribed: "subscribed" });
      if (!restaurant) {
        return res.status(401).json("No Restaurants Featured");
      } else {
        res.status(200).json(restaurant);
      }
    } catch (error) {
      res.status(500).send({ message: "Server Error!" });
    }
  })
);
resRouter.get(
  "/:resName/:_id/:source",
  expressAsyncHandler(async (req, res) => {
    const { _id, source } = req.params;
    try {
      const restaurant = await Restaurant.findById(_id);
      if (!restaurant) {
        return res.status(401).send("No restaurant found!");
      } else {
        const visit = {
          source: source,
        };
        restaurant.visits.push(visit);
        await restaurant.save();
        res.status(200).json(restaurant);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

resRouter.post(
  "/send-registration",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const {
      image,
      resName,
      owner,
      email,
      phoneNo,
      address,
      category,
      description,
    } = req.body;
    const newRes = new RegRestaurants({
      image,
      resName,
      owner,
      email,
      phoneNo,
      address,
      category,
      description,
    });
    const existingName = await Restaurant.findOne({ resName });
    if (existingName) {
      res
        .status(403)
        .send({ message: "The restaurant name has already been used!" });
      return;
    }
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.DineE,
          pass: process.env.DineP,
        },
      });
      const mailOption = {
        from: '"Restaurant Registration" <reset@dineretso.com>',
        to: process.env.DineE,
        subject: "New Restaurant Registration",
        html: `
        <p>A new restaurant registration has been submitted:</p>
        <p>Restaurant Name: ${resName}</p>
        <p>Owner: ${owner}</p>
        <p>Email: ${email}</p>
        <p>Phone Number: ${phoneNo}</p>
        <p>Address: ${address}</p>
        <p>Category: ${category}</p>
        <p>Description: ${description}</p>
      `,
      };
      const info = await transporter.sendMail(mailOption);
      await newRes.save();
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      res
        .status(201)
        .json({ message: "Registration has been sent to DineRetso" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Server Error!" });
    }
  })
);
resRouter.post(
  "/check-register-history",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const regHistory = await RegRestaurants.find({ email: req.body.email });
    try {
      if (regHistory.length > 0) {
        res.send(regHistory);
      } else {
        res
          .status(201)
          .send({ message: "No restaurant registration history!" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error!" });
    }
  })
);
module.exports = resRouter;
