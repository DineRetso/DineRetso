const express = require("express");
const nodemailer = require("nodemailer");
const User = require("../Models/User_Model.js");
const Restaurant = require("../Models/Restaurant_Model.js");
const SData = require("../Models/SignupModel.js");
const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { generateToken, generateResetToken, isAuth } = require("../utils.js");

dotenv.config();
const userRouter = express.Router();

userRouter.get(
  "/get-user/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const requestedUserId = req.params.id;
    const authorizedUserId = req.user._id;
    // Check if the authorized user matches the requested user
    if (requestedUserId !== authorizedUserId) {
      return res.status(403).send({ message: "Unauthorized access" });
    }
    const user = await User.findById(requestedUserId);
    try {
      if (user) {
        res.send(user);
      } else {
        res.status(200).send({ message: "No User Found!" });
      }
    } catch (error) {
      res
        .status(500)
        .send({ message: "Internal Server Error! Please Try again later!" });
    }
  })
);
userRouter.get(
  "/getUserProfile/:userId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    try {
      const response = await User.findById(userId);
      const restaurants = await Restaurant.find({});
      const userReviews = [];
      restaurants.forEach((restaurant) => {
        if (restaurant) {
          const userRestoReviews = restaurant.restoReview.filter(
            (review) => review.reviewerId === userId
          );
          const userMenuReviews = [];
          restaurant.menu.forEach((menu) => {
            const menuReviews = menu.menuReview.filter(
              (review) => review.reviewerId === userId
            );
            userMenuReviews.push(...menuReviews);
          });
          userReviews.push(...userRestoReviews, ...userMenuReviews);
        }
      });
      if (response) {
        const responseData = {
          user: response,
          userReviews: userReviews,
        };
        res.status(200).json(responseData);
      } else {
        res.status(404).send({ message: "User Unavailable" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error: " + error });
    }
  })
);

userRouter.put(
  "/updateUserProfile/:userId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { fName, lName, image, imagePublicId, password, address, mobileNo } =
      req.body;
    try {
      console.log(userId);
      const user = await User.findById(userId);
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          user.fName = fName;
          user.lName = lName;
          user.image = image;
          user.imagePublicId = imagePublicId;
          user.address = address;
          user.mobileNo = mobileNo;
          await user.save();
          res.status(200).json({ message: "Profile updated successfully" });
        } else {
          res.status(400).send({ message: "Invalid Password!" });
        }
      } else {
        res.status(404).send({ message: "User Unavailable." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error: " + error });
    }
  })
);

userRouter.post(
  "/send-otp",
  expressAsyncHandler(async (req, res) => {
    const {
      email,
      otp,
      fName,
      lName,
      address,
      mobileNo,
      password,
      expiration,
    } = req.body;

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.DineE,
          pass: process.env.DineP,
        },
      });

      const mailOption = {
        from: '"DineRetso" <reset@dineretso.com>',
        to: email,
        subject: "Your OTP Verification Code",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <title>DineRetso OTP Verification</title>
        </head>
        <body>
        <p>Hello,</p>
        <p>Your OTP code for verification is:</p>
        <p style="font-size: 24px; font-weight: bold;">${otp}</p>
        <p>Use this code to complete your verification process.</p>
        <p>Thank you for using DineRetso.</p>
        </body>
        </html>
      `,
      };
      const info = await transporter.sendMail(mailOption);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      const hashedPassword = await bcrypt.hash(password, 10);
      const hashedOTP = await bcrypt.hash(otp, 10);
      const newSignup = new SData({
        fName,
        lName,
        address,
        mobileNo,
        email,
        password: hashedPassword,
        otp: hashedOTP,
        expiration,
      });
      await newSignup.save();
      res.status(200).json({ message: "Email sent successfully", newSignup });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Error sending email" });
    }
  })
);
userRouter.post(
  "/userInfo",
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById({ _id: req.body._id });
      if (!user) {
        return res.sendStatus(404);
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ isAdmin: user.isAdmin, isOwner: user.isOwner });
    } catch (error) {
      console.error("Error fetching user info:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);
userRouter.get(
  "/getOtp",
  expressAsyncHandler(async (req, res) => {
    const id = req.query.id;
    console.log(id);
    try {
      const signupdata = await SData.findById(id);
      if (!signupdata) {
        return res.status(400).send({ message: "Invalid OTP" });
      } else {
        res.status(200).json(signupdata);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error: " + error });
    }
  })
);
userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const {
      fName,
      lName,
      address,
      mobileNo,
      email,
      password,
      enteredOTP,
      otp,
    } = req.body;
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }
    if (bcrypt.compareSync(enteredOTP, otp)) {
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
    } else {
      res.status(404).send({ message: "Invalid OTP" });
      return;
    }
  })
);
userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const lockoutDuration = 5 * 60 * 1000;
      const currentTime = new Date();
      const lockoutEndTime = user.lastFailedLogin
        ? new Date(user.lastFailedLogin.getTime() + lockoutDuration)
        : currentTime;

      if (user.attempt >= 3 && lockoutEndTime > currentTime) {
        return res
          .status(401)
          .send({ message: "Account locked. Try again later." });
      }

      if (bcrypt.compareSync(req.body.password, user.password)) {
        if (user.attempt >= 3 && lockoutEndTime <= currentTime) {
          user.attempt = 0;
          user.lastFailedLogin = undefined;
        }
        await user.save();
        res.json({
          _id: user._id,
          fName: user.fName,
          lName: user.lName,
          address: user.address,
          mobileNo: user.mobileNo,
          email: user.email,
          isOwner: user.isOwner,
          myRestaurant: user.myRestaurant,
          linkId: user.linkId,
          token: generateToken(user),
        });
      } else {
        user.attempt += 1;
        user.lastFailedLogin = new Date();
        await user.save();
        res.status(401).send({ message: "Invalid Password!" });
      }
    } else {
      res.status(401).send({ message: "Invalid Email or password!" });
    }
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

userRouter.post(
  "/reset-password",
  expressAsyncHandler(async (req, res) => {
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
  })
);

module.exports = userRouter;
