const express = require("express");
const nodemailer = require("nodemailer");
const User = require("../Models/User_Model.js");
const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");

dotenv.config();
const userRouter = express.Router();
userRouter.post(
  "/send-otp",
  expressAsyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.DineE,
          pass: process.env.DineP,
        },
      });

      const mailOption = {
        from: process.env.DineE,
        to: email,
        subject: "Your OTP Verification Code",
        text: `Your OTP code is: ${otp}`,
      };
      const info = await transporter.sendMail(mailOption);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Error sending email" });
    }
  })
);
userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const { fName, lName, address, mobileNo, email, password } = req.body;
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }
    try {
      const newUser = new User({
        fName,
        lName,
        address,
        mobileNo,
        email,
        password,
      });
      const user = await newUser.save();
      res.status(201).json({ message: "Your account has been saved!" });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Error creating user" });
    }
  })
);

module.exports = userRouter;
