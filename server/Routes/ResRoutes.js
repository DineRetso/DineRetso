const express = require("express");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const RegRestaurants = require("../Models/Register_Model.js");

dotenv.config();
const resRouter = express.Router();

resRouter.post(
  "/send-registration",
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

resRouter.get("/pendingResto", async (req, res) => {
  const pendingResto = await RegRestaurants.find();
  if (pendingResto) {
    res.send(pendingResto);
  } else {
    res.status(401).send({ message: "No Pending Restaurants!" });
  }
});
resRouter.get("/pendingRestoInfo/:id", async (req, res) => {
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
module.exports = resRouter;
