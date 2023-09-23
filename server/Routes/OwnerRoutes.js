const express = require("express");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const RegRestaurants = require("../Models/Register_Model.js");
const Restaurant = require("../Models/Restaurant_Model.js");
const User = require("../Models/User_Model.js");
const { isAuth, isOwner } = require("../utils.js");

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
      res.status(200).json({
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
    console.log("_id:", _id);
    console.log("menuId:", menuId);
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
module.exports = ownerRouter;
