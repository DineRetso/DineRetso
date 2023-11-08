const mongoose = require("mongoose");
const signupSchema = new mongoose.Schema(
  {
    fName: { type: String, required: true },
    lName: { type: String, required: true },
    address: { type: String, required: true },
    mobileNo: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    otp: { type: String, required: true },
    expiration: { type: Date, required: true },
  },
  { timestamps: true, collection: "Signups" }
);
const SData = mongoose.model("Signups", signupSchema);
module.exports = SData;
