const express = require("express");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const RegRestaurants = require("../Models/Register_Model.js");
const Restaurant = require("../Models/Restaurant_Model.js");
const User = require("../Models/User_Model.js");
const Dine = require("../Models/AdminModel.js");
const Posting = require("../Models/PostingModels.js");
const { generateAdminToken, isAdminAuth, isAdmin } = require("../utils.js");

const adminRouter = express.Router();
dotenv.config();

adminRouter.post(
  "/dineInfo",
  expressAsyncHandler(async (req, res) => {
    try {
      const dine = await Dine.findById({ _id: req.body._id });
      if (!dine) {
        return res.sendStatus(404);
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ isAdmin: dine.isAdmin });
    } catch (error) {
      console.error("Error fetching user info:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

adminRouter.post(
  "/admin-login",
  expressAsyncHandler(async (req, res) => {
    const dine = await Dine.findOne({ username: req.body.username });
    if (dine) {
      const lockoutDuration = 5 * 60 * 1000;
      const currentTime = new Date();
      const lockoutEndTime = dine.lastFailedLogin
        ? new Date(dine.lastFailedLogin.getTime() + lockoutDuration)
        : currentTime;
      if (dine.attempt >= 3 && lockoutEndTime > currentTime) {
        return res
          .status(401)
          .send({ message: "Account locked. Try again later." });
      }
      if (bcrypt.compareSync(req.body.password, dine.password)) {
        if (dine.attempt >= 3 && lockoutEndTime <= currentTime) {
          dine.attempt = 0;
          dine.lastFailedLogin = undefined;
        }
        await dine.save();
        res.json({
          _id: dine._id,
          name: dine.name,
          username: dine.username,
          email: dine.email,
          token: generateAdminToken(dine),
        });
      } else {
        dine.attempt += 1;
        dine.lastFailedLogin = new Date();
        await dine.save();
        res.status(401).send({ message: "Invalid Password!" });
      }
    } else {
      res.status(401).send({ message: "Invalid Email or password!" });
    }
  })
);
adminRouter.get(
  "/pendingResto",
  isAdminAuth,
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
  isAdminAuth,
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
  isAdminAuth,
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
  isAdminAuth,
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
        description: resto.description,
        postStatus: "pending",
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
  isAdminAuth,
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

adminRouter.get(
  "/getUsers",
  isAdminAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.find();
    try {
      if (user) {
        res.send(user);
      } else {
        res.status(401).send({ message: "No restaurant found!" });
      }
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error!" });
    }
  })
);
adminRouter.get(
  "/getCustomers",
  isAdminAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const customer = await User.find();
    try {
      if (customer) {
        res.status(200).json(customer);
      } else {
        return res.status(404).json({ message: "No Customers" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  })
);
adminRouter.get(
  "/getResto/:id",
  isAdminAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
      const resto = await Restaurant.findById(id);
      if (resto) {
        res.status(200).json(resto);
      } else {
        return res.status(404).json({ message: "No restaurant found" });
      }
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
  })
);

adminRouter.post("/create", async (req, res) => {
  try {
    const {
      resID,
      title,
      description,
      tags,
      images,
      type,
      resName,
      address,
      fbLink,
      igLink,
      webLink,
      category,
    } = req.body;

    // Create a new BlogPost document
    const blogPost = new Posting({
      resID,
      title,
      description,
      tags,
      type,
      resName,
      address,
      fbLink,
      igLink,
      webLink,
      category,
      images: images, // Store Cloudinary image URLs
    });

    // Save the blog post to the database
    await blogPost.save();
    console.log(blogPost);
    const restaurant = await Restaurant.findById(resID);
    console.log;
    if (restaurant) {
      restaurant.blogPosts.push(blogPost._id);
      restaurant.postCount += 1;
      await restaurant.save();
    }

    res.status(201).json({ message: "Blog post created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

adminRouter.get(
  "/getPosting",
  isAdminAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const posts = await Posting.find();
      if (posts) {
        res.status(200).json(posts);
      } else {
        res.status(404).send({ message: "No posts found." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

module.exports = adminRouter;

// adminRouter.post(
//   "/admin-signup",
//   expressAsyncHandler(async (req, res) => {
//     const { name, username, email, password, phoneNo, address } = req.body;

//     // Check if the username or email already exists in the database.
//     const existingUser = await Dine.findOne({
//       userName,
//     });

//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ message: "Username or email already exists." });
//     }

//     // Hash the password before storing it in the database.
//     const hashedPassword = bcrypt.hashSync(password, 10);

//     // Create a new admin user.
//     const adminUser = new Dine({
//       name,
//       username,
//       email,
//       password: hashedPassword,
//       phoneNo,
//       address,
//     });

//     // Save the new admin user to the database.
//     await adminUser.save();

//     // Respond with a success message or user data.
//     res.status(201).json({ message: "Admin user created successfully." });
//   })
// );
