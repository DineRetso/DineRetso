const express = require("express");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const RegRestaurants = require("../Models/Register_Model.js");
const Restaurant = require("../Models/Restaurant_Model.js");
const { isAuth, isAdmin } = require("../utils.js");

dotenv.config();
const resRouter = express.Router();

resRouter.post(
  "/send-registration",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { image, resName, owner, email, phoneNo, address, category } =
      req.body;
    const newRes = new RegRestaurants({
      image,
      resName,
      owner,
      email,
      phoneNo,
      address,
      category,
    });
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
      res.status(500).json({ message: "Error sending email!" });
    }
  })
);

resRouter.get("/pendingResto", isAuth, isAdmin, async (req, res) => {
  const pendingResto = await RegRestaurants.find({
    isConfirmed: "NotConfirmed",
  });
  if (pendingResto.length > 0) {
    res.send(pendingResto);
  } else {
    res.status(401).send({ message: "No Pending Restaurants!" });
  }
});
resRouter.get("/pendingRestoInfo/:id", isAuth, isAdmin, async (req, res) => {
  const id = req.params.id;
  const pendingResto = await RegRestaurants.findById(id);
  try {
    if (pendingResto) {
      res.send(pendingResto);
    } else {
      res.status(401).send({ message: "No restaurant found!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error!" });
  }
});
resRouter.post("/cancelRegistration", isAuth, isAdmin, async (req, res) => {
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
});
resRouter.post("/confirmRegistration", isAuth, isAdmin, async (req, res) => {
  const { _id } = req.body;
  try {
    const resto = await RegRestaurants.findOne({ _id });
    if (!resto) {
      return res
        .status(404)
        .json({ message: "No specific pending restaurant found!" });
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
    resto.isConfirmed = "Confirmed";
    await newResto.save();
    await resto.save();
    res
      .status(201)
      .json({ message: "Restaurant has been saved to directory!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error accepting restaurant!" });
  }
});
resRouter.get("/getRestaurants", isAuth, isAdmin, async (req, res) => {
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
});
module.exports = resRouter;
