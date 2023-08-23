const express = require("express");
const nodemailer = require("nodemailer");
const User = require("../Models/User_Model.js");
const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { generateToken, generateResetToken } = require("../utils.js");

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
    const role = bcrypt.hashSync("User", 10);
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
        role,
      });
      const user = await newUser.save();
      res.status(201).json({ message: "Your account has been saved!" });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Error creating user" });
    }
  })
);
userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.json({
          _id: user._id,
          fName: user.fName,
          lName: user.lName,
          address: user.address,
          mobileNo: user.mobileNo,
          role: user.role,
          email: user.email,
          password: user.password,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid Email or password!" });
  })
);
userRouter.post(
  "/forget-password",
  expressAsyncHandler(async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User Not Found!" });
      }
      const resetToken = generateResetToken();
      user.resetToken = resetToken;
      user.resetTokenExpires = Date.now() + 3600000;
      await user.save();
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.DineE,
            pass: process.env.DineP,
          },
        });
        const resetPasswordURL = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;
        const emailHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Password Reset Email</title>
          </head>
          <body>
            <h1>Password Reset</h1>
            <p>You have requested to reset your password. Click the link below to reset your password:</p>
            <a href="${resetPasswordURL}">Password Reset Link</a>
            <p>If you didn't request this, please ignore this email.</p>
          </body>
          </html>
          `;
        const mailOption = {
          from: '"DineRetso Reset Password" <reset@dineretso.com>',
          to: email,
          subject: "Your Reset Password Link",
          html: emailHTML,
        };
        await transporter.sendMail(mailOption);
        res.status(200).json({ message: "Email sent successfully" });
      } catch (error) {
        console.error("Error sending email:", error);
        res.status(401).json({ message: "Error sending email" });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Server Error! Please try again later!" });
    }
  })
);

userRouter.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = userRouter;
