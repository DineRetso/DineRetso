const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phoneNo: { type: String, required: true },
    address: { type: String, required: true },
    name: { type: String, required: true },
    isAdmin: { type: Boolean, default: true },
    lastFailedLogin: { type: Date },
    attempt: { type: Number, default: 0, required: true },
  },
  {
    timestamps: true,
    collection: "DineRetso",
  }
);
const Dine = mongoose.model("DineRetso", adminSchema);
module.exports = Dine;
