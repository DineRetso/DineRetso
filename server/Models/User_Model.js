const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fName: { type: String, required: true },
    lName: { type: String, required: true },
    address: { type: String, required: true },
    mobileNo: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    isOwner: { type: Boolean, default: false, required: true },
    myRestaurant: { type: String, unique: true },
    attempt: { type: Number, default: 0, required: true },
    lastFailedLogin: { type: Date },
    resetToken: { type: String },
    resetTokenExpires: { type: Date },
  },
  {
    timestamps: true,
    collection: "Users",
  }
);
const User = mongoose.model("Users", userSchema);
module.exports = User;
