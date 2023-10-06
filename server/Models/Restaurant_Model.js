const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    image: { type: String },
    comment: { type: String, required: true },
    reviewerName: { type: String, required: true },
    location: { type: String },
    status: { type: String, required: true },
    rating: { type: Number, required: true },
    source: { type: String, required: true },
    menuId: { type: String },
  },
  {
    timestamps: true,
  }
);
const menuSchema = new mongoose.Schema(
  {
    menuImage: { type: String },
    imagePublicId: { type: String },
    menuName: { type: String, required: true },
    description: { type: String },
    isAvailable: { type: Boolean, default: true },
    price: { type: Number, required: true },
    menuReview: [reviewSchema],
    classification: { type: String },
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const visitSchema = new mongoose.Schema({
  source: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const newSchema = new mongoose.Schema(
  {
    profileImage: { type: String, required: true },
    bgPhoto: { type: String },
    resName: { type: String, required: true, unique: true },
    owner: { type: String, required: true },
    email: { type: String, required: true },
    phoneNo: { type: String, required: true },
    description: { type: String },
    fbLink: { type: String },
    igLink: { type: String },
    webLink: { type: String },
    category: { type: String, required: true },
    address: { type: String, required: true },
    pinLocation: { type: String },
    openAt: { type: Date },
    closeAt: { type: Date },
    restoReview: [reviewSchema],
    visits: [visitSchema],
    isSubscribed: { type: String, default: "not subscribed" },
    menu: [menuSchema],
    tags: [{ type: String }],
  },
  { timestamps: true, collection: "Restaurants" }
);
const Restaurant = mongoose.model("Restaurants", newSchema);
module.exports = Restaurant;
