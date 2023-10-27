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
  "/getPosting/:resId/:status",
  isAuth,
  isOwner,
  expressAsyncHandler(async (req, res) => {
    const { resId, status } = req.params;
    try {
      const posts = await Posting.find({ resId: resId, status: status });
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
          paymentType: restaurant.paymentType,
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
        video,
      } = req.body;
      console.log(video);
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
        status: "Pending",
        webLink,
        category,
        images: images,
        video,
      });

      await blogPost.save();
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

      await cloudinary.uploader.destroy(deletedPost.video.public_id);

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
ownerRouter.get(
  "/getProfile/:userId",
  isAuth,
  isOwner,
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
        const resto = await Restaurant.findById(response.myRestaurant);

        if (resto) {
          const responseData = {
            user: response,
            restaurant: resto,
            userReviews: userReviews,
          };
          res.status(200).json(responseData);
        } else {
          res.status(404).send({ message: "Restaurant Unavailable" });
        }
      } else {
        res.status(404).send({ message: "User Unavailable" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error: " + error });
    }
  })
);
ownerRouter.put(
  "/updateProfile/:userId",
  isAuth,
  isOwner,
  expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { fName, lName, image, imagePublicId, password, address, mobileNo } =
      req.body;
    try {
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
ownerRouter.put(
  "/changePassword/:userId",
  isAuth,
  isOwner,
  expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { newPassword, password } = req.body;
    try {
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).send({ message: "User Unavailable." });
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          user.password = hashedPassword;
          await user.save();
          res.status(200).send({ message: "Password Updated" });
        } else {
          res.status(400).send({ message: "Invalid Password!" });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error: " + error });
    }
  })
);
module.exports = ownerRouter;
