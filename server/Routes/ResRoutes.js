const express = require("express");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const RegRestaurants = require("../Models/Register_Model.js");
const Restaurant = require("../Models/Restaurant_Model.js");
const User = require("../Models/User_Model.js");
const Posting = require("../Models/PostingModels.js");
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
  "/getMenus",
  expressAsyncHandler(async (req, res) => {
    try {
      const restaurant = await Restaurant.find();
      if (!restaurant) {
        return res.status(404).json({ message: "No Menu Available" });
      } else {
        const menuData = restaurant.map((restaurant) => ({
          resName: restaurant.resName,
          category: restaurant.category,
          address: restaurant.address,
          openAt: restaurant.openAt,
          closeAt: restaurant.closeAt,
          isSubscribed: restaurant.isSubscribed,
          menu: restaurant.menu,
          tags: restaurant.tags,
        }));
        res.status(200).json(menuData);
      }
    } catch (error) {
      console.error(errror);
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
  "/:resName/:source",
  expressAsyncHandler(async (req, res) => {
    const { resName, source } = req.params;
    try {
      const restaurant = await Restaurant.findOne({
        resName: resName,
      }).populate("blogPosts");
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
  "/add-review/:_id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { _id } = req.params;
    try {
      const restaurant = await Restaurant.findById(_id);
      if (!restaurant) {
        return res.status(401).send("No restaurant found!");
      } else {
        const { reviewerId, reviewerName, comment, rating, location } =
          req.body;
        const review = {
          reviewerName: reviewerName,
          comment: comment,
          rating: rating,
          location: location,
          reviewerId: reviewerId,
          status: "pending",
          source: "Restaurant",
          createdAt: new Date(),
        };
        restaurant.restoReview.push(review);
        await restaurant.save();
        console.log(review);
        res.status(200).json({ message: "Review submitted!", review });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  })
);

resRouter.post(
  "/add-menu-review/:pid",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { pid } = req.params;
    try {
      const restaurant = await Restaurant.findById(pid);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found!" });
      }
      const { reviewerId, reviewerName, comment, rating, location, menuId } =
        req.body;
      const menuItem = restaurant.menu.id(menuId);
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found!" });
      }
      const newReview = {
        status: "pending",
        source: "Menu",
        menuId: menuId,
        reviewerId: reviewerId,
        reviewerName,
        comment,
        rating,
        location,
      };
      menuItem.menuReview.push(newReview);
      await restaurant.save();
      res.status(200).json({ message: "Menu review Submitted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
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
resRouter.get(
  "/getPosting",
  expressAsyncHandler(async (req, res) => {
    try {
      const posts = await Posting.find({ status: "Approved" });
      if (posts) {
        res.status(200).json(posts);
      } else {
        res.status(404).send({ message: "No post available." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error " + error });
    }
  })
);
resRouter.get(
  "/getResto/posting/:id/:postSource",
  expressAsyncHandler(async (req, res) => {
    const { id, postSource } = req.params;
    console.log(id);
    try {
      const posts = await Posting.findById(id);
      if (posts) {
        const restaurant = await Restaurant.findOne({ resName: posts.resName });
        if (restaurant) {
          if (postSource === "web") {
            restaurant.visits.push({
              source: postSource,
              timestamp: new Date(),
            });
          } else if (postSource === "email") {
            restaurant.visits.push({
              source: postSource,
              timestamp: new Date(),
            });
          } else {
            restaurant.visits.push({
              source: "facebook",
              timestamp: new Date(),
            });
          }
          await restaurant.save();
        }

        res.status(200).json(posts);
      } else {
        res.status(404).send({ message: "No posts found." });
      }
      console.log(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error: " + error });
    }
  })
);
module.exports = resRouter;
