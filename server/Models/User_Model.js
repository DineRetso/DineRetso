const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fName: { type: String, required: true },
    lName: { type: String, required: true },
    address: { type: String, required: true },
    mobileNo: { type: String, required: true },
    isOwner: { type: Boolean, default: false, required: true },
    myRestaurant: { type: String },
    attempt: { type: Number, default: 0, required: true },
    lastFailedLogin: { type: Date },
    resetToken: { type: String },
    resetTokenExpires: { type: Date },
    subscriptionStatus: {
      type: String,
      enum: ["subscribed", "not subscribed", "expired"],
      default: "not subscribed",
    },
    subscriptionPlan: {
      type: String, // You can store the name or ID of the subscribed plan
      default: null, // Set to null if user is not subscribed
    },
    subscriptionStartDate: {
      type: Date,
      default: null, // Set to null if user is not subscribed
    },
    subscriptionEndDate: {
      type: Date,
      default: null, // Set to null if user is not subscribed
    },
  },
  {
    timestamps: true,
    collection: "Users",
  }
);
const User = mongoose.model("Users", userSchema);
module.exports = User;
