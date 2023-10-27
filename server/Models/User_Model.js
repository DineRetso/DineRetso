const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    image: { type: String },
    imagePublicId: {type: String},
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
    linkId: { type: String },
    emailSent: { type: Boolean, default: false },
    subscriptionStatus: {
      type: String,
      enum: ["subscribed", "not subscribed", "expired"],
      default: "not subscribed",
    },
    subscriptionType: { type: String },
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
