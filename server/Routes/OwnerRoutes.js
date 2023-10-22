const express = require("express");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const RegRestaurants = require("../Models/Register_Model.js");
const Restaurant = require("../Models/Restaurant_Model.js");
const Posting = require("../Models/PostingModels.js");
const User = require("../Models/User_Model.js");
const Payments = require("../Models/PaymentModel.js");
const { isAuth, isOwner } = require("../utils.js");
const mongoose = require("mongoose");

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
ownerRouter.post(
  "/restaurant/edit-menu-item/:restaurantID",
  isAuth,
  isOwner,
  expressAsyncHandler(async (req, res) => {
    try {
      const { restaurantID } = req.params;
      const { _id, menuName, description, price, menuImage, imagePublicId } =
        req.body;
      const restaurant = await Restaurant.findById(restaurantID);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found!" });
      }
      const menuItem = restaurant.menu.find(
        (item) => item._id.toString() === _id
      );
      if (!menuItem) {
        return res
          .status(404)
          .json({ message: "Menu item not found in the restaurant" });
      }
      menuItem.menuName = menuName;
      menuItem.description = description;
      menuItem.price = price;
      menuItem.menuImage = menuImage;
      menuItem.imagePublicId = imagePublicId;

      await restaurant.save();
      return res.status(200).json({ message: "Menu updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

//manageReview
ownerRouter.post(
  "/restaurant/manage-review/:restaurantID",
  isAuth,
  isOwner,
  expressAsyncHandler(async (req, res) => {
    try {
      const { restaurantID } = req.params;
      const { menuId, id, status } = req.body;
      const restaurant = await Restaurant.findById(restaurantID);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      if (menuId) {
        const menu = restaurant.menu.find(
          (item) => item._id.toString() === menuId
        );
        if (!menu) {
          return res.status(404).json({ message: "Menu not found" });
        }

        // manageMenuReview
        const menuReview = menu.menuReview.find(
          (item) => item._id.toString() === id
        );
        if (!menuReview) {
          return res.status(404).json({ message: "Menu review not found!" });
        }

        menuReview.status = status;
        await restaurant.save();
        return res
          .status(200)
          .json({ message: "Menu review updated successfully" });
      }
      //manage restoReview
      else {
        const resRev = restaurant.restoReview.find(
          (item) => item._id.toString() === id
        );
        if (!resRev) {
          return res.status(404).json({ message: "Resto review not found!" });
        }
        resRev.status = status;
        await restaurant.save();
        return res.status(200).json({ message: "Menu updated successfully" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  })
);

//addMenu
ownerRouter.post(
  "/restaurant/add-menu-item/:restaurantID",
  isAuth,
  isOwner,
  expressAsyncHandler(async (req, res) => {
    try {
      const { restaurantID } = req.params;
      const {
        menuName,
        description,
        price,
        menuImage,
        classification,
        imagePublicId,
      } = req.body;
      const restaurant = await Restaurant.findById(restaurantID);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      const newMenuItem = {
        menuImage: menuImage,
        menuName: menuName,
        description: description,
        price: price,
        classification: classification,
        imagePublicId: imagePublicId,
      };
      restaurant.menu.push(newMenuItem);
      await restaurant.save();
      const newMenuItemId = restaurant.menu[restaurant.menu.length - 1]._id;
      res.status(200).json({
        _id: newMenuItemId,
        menuName: menuName,
        description: description,
        price: price,
        menuImage: menuImage,
        classification: classification,
        imagePublicId: imagePublicId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

ownerRouter.delete(
  "/:_id/:menuId",
  expressAsyncHandler(async (req, res) => {
    const { _id, menuId } = req.params;
    try {
      const restaurant = await Restaurant.findById(_id);
      console.log(restaurant);
      if (!restaurant) {
        console.log(`Restaurant with ID ${_id} not found.`);
        return res.status(404).json({ message: "Restaurant not found" });
      }
      const menuIndex = restaurant.menu.findIndex(
        (menuItem) => menuItem._id.toString() === menuId
      );

      if (menuIndex === -1) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      restaurant.menu.splice(menuIndex, 1);
      await restaurant.save();
      res.status(200).json({ message: "Menu item deleted successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while deleting the menu item" });
    }
  })
);
ownerRouter.get(
  "/payment/:_id",
  isAuth,
  isOwner,
  expressAsyncHandler(async (req, res) => {
    try {
      const { _id } = req.params;

      const payment = await Payments.find({ payeeResId: _id });
      if (payment) {
        return res.status(200).json(payment);
      }
      return res.status(404).json({ message: "No Payment transaction." });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message:
          "An error occurred while fetching payment. Please try again later",
      });
    }
  })
);
ownerRouter.get(
  "/getPaymentDetails/:paymentId",
  isAuth,
  isOwner,
  expressAsyncHandler(async (req, res) => {
    try {
      const { paymentId } = req.params;
      const payment = await Payments.findById(paymentId);
      if (payment) {
        return res.status(200).json(payment);
      } else {
        return res.status(404).json({ message: "No payment found!" });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Internal Server Error. Please contact DineRetso" });
    }
  })
);
ownerRouter.get("/approved-reviews/:restaurantId", async (req, res) => {
  const restaurantId = req.params.restaurantId;
  try {
    const restaurant = await Restaurant.findOne({ _id: restaurantId });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    // Filter and combine approved reviews for both restaurant and menu
    const approvedRestoReviews = restaurant.restoReview.filter(
      (review) => review.status === "approved"
    );

    const approvedMenuReviews = restaurant.menu.flatMap((menu) =>
      menu.menuReview.filter((review) => review.status === "approved")
    );

    const allApprovedReviews = [
      ...approvedRestoReviews,
      ...approvedMenuReviews,
    ];

    res.json(allApprovedReviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
ownerRouter.get("/reviews/:reviewerId", async (req, res) => {
  const { reviewerId } = req.params;
  try {
    const restaurantWithMenuReview = await Restaurant.findOne({
      "menu.menuReview.reviewerId": reviewerId,
    });
    const restaurantWithRestoReview = await Restaurant.findOne({
      "restoReview.reviewerId": reviewerId,
    });
    const matchingReviews = [];
    if (restaurantWithMenuReview) {
      restaurantWithMenuReview.menu.forEach((menu) => {
        menu.menuReview.forEach((review) => {
          if (review.reviewerId === reviewerId) {
            matchingReviews.push(review);
          }
        });
      });
    }
    if (restaurantWithRestoReview) {
      restaurantWithRestoReview.restoReview.forEach((review) => {
        if (review.reviewerId === reviewerId) {
          matchingReviews.push(review);
        }
      });
    }
    if (!matchingReviews) {
      return res
        .status(404)
        .json({ message: "No reviews found for this reviewerId" });
    }
    res.status(200).json(matchingReviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
ownerRouter.get("/getMenu/:resto", async (req, res) => {
  try {
    const { resto } = req.params;
    const response = await Restaurant.findById(resto);
    if (!response) {
      return res.status(404).send({ message: "Not Found" });
    } else {
      res.json({ menu: response.menu });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" + error });
  }
});
//getOwnerPosting
ownerRouter.get(
  "/getPosting/:resId",
  isAuth,
  isOwner,
  expressAsyncHandler(async (req, res) => {
    const { resId } = req.params;
    try {
      const posts = await Posting.find({ resId: resId });
      if (posts) {
        res.status(200).json(posts);
      } else {
        res.status(404).send({ message: "No posts found." });
      }
      console.log(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);
ownerRouter.get(
  "/posting/getResto",
  isAuth,
  isOwner,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.query;

    try {
      const restaurant = await Restaurant.findById(id);
      if (restaurant) {
        const resto = {
          _id: restaurant._id,
          resName: restaurant.resName,
          address: restaurant.address,
          fbLink: restaurant.fbLink,
          igLink: restaurant.igLink,
          webLink: restaurant.webLink,
          category: restaurant.category,
          postCount: restaurant.postCount,
        };
        res.status(200).json(resto);
      } else {
        res.status(404).send({ message: "Invalid Resto" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  })
);

function sendEmailPosting(userEmails, blogPost) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.DineE,
      pass: process.env.DineP,
    },
  });
  const mailPromises = userEmails.map((userEmail) => {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: `DineRetso <${process.env.DineE}>`,
        to: userEmail,
        subject: "New Blog Post Created",
        html: `
          <p>Hello,</p>
          <p>A new blog post "${blogPost.title}" has been created for your restaurant "${blogPost.resName}".</p>
          <img src="${blogPost.images[0].secure_url}" alt="Blog Post Image" />
          <p><strong>Description:</strong></p>
          ${blogPost.description}
          <p>Read the post <a href="URL_TO_THE_POST">here</a>.</p>
          <p>Thank you for using our service.</p>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(`Error sending email to ${userEmail}: ${error}`);
          reject(error);
        } else {
          console.log(`Email sent to ${userEmail}: ${info.response}`);
          resolve(info);
        }
      });
    });
  });

  return Promise.all(mailPromises);
}

ownerRouter.post(
  "/posting/create",
  isAuth,
  isOwner,
  expressAsyncHandler(async (req, res) => {
    try {
      const {
        resId,
        title,
        description,
        tags,
        images,
        resName,
        address,
        fbLink,
        igLink,
        webLink,
        category,
      } = req.body;
      const blogPost = new Posting({
        resId,
        title,
        description,
        tags,
        images,
        resName,
        address,
        fbLink,
        igLink,
        webLink,
        category,
        images: images,
      });

      await blogPost.save();
      console.log(blogPost);
      const restaurant = await Restaurant.findById(resId);
      if (restaurant) {
        restaurant.blogPosts.push(blogPost._id);
        restaurant.postCount += 1;
        await restaurant.save();
      }
      const users = await User.find({}, "email");
      const userEmails = users.map((user) => user.email);
      await sendEmailPosting(userEmails, blogPost);

      res.status(200).json({ message: "Post Created" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error:" + error });
    }
  })
);

ownerRouter.put(
  "/posting/edit/:id",
  isAuth,
  isOwner,
  expressAsyncHandler(async (req, res) => {
    try {
      const postId = req.params.id;
      const { title, description, tags, images } = req.body;

      const updatedPost = await Posting.findById(postId);

      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      updatedPost.title = title;
      updatedPost.description = description;
      updatedPost.tags = tags;
      updatedPost.images = images;

      await updatedPost.save();

      res.status(200).json({ message: "Post Updated" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error:" + error });
    }
  })
);

ownerRouter.delete(
  "/posting/delete/:id",
  isAuth,
  isOwner,
  expressAsyncHandler(async (req, res) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_API,
      secure: true,
    });
    try {
      const postId = req.params.id;

      const deletedPost = await Posting.findById(postId);

      if (!deletedPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Delete associated images from Cloudinary
      for (const image of deletedPost.images) {
        await cloudinary.uploader.destroy(image.public_id);
      }

      await Posting.deleteOne({ _id: postId });

      res.status(200).json({ message: "Post Deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error:" + error });
    }
  })
);

ownerRouter.get(
  "/getOwnerPost",
  isAuth,
  isOwner,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.query;
    try {
      console.log(id);
      const Posts = await Posting.findById(id);
      if (Posts) {
        res.status(200).json(Posts);
      } else {
        res.status(400).send({ message: "Post not found." });
      }
      console.log(Posts);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error: " + error });
    }
  })
);
module.exports = ownerRouter;
