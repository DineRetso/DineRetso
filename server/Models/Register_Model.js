const mongoose = require("mongoose");
const resSchema = new mongoose.Schema(
  {
    image: { type: String },
    resName: { type: String, required: true },
    owner: { type: String, required: true },
    email: { type: String, required: true },
    phoneNo: { type: String, required: true },
    address: { type: String, required: true },
    category: { type: String, required: true },
    isConfirmed: { type: String, default: "NotConfirmed" },
    reasonCancelled: { type: String },
  },
  {
    timestamps: true,
    collection: "RegRestaurants",
  }
);
const User = mongoose.model("RegRestaurants", resSchema);
module.exports = User;
