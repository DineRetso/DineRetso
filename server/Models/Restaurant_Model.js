const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    image: { type: String },
    resName: { type: String },
    reviewerId: { type: String, required: true },
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
    resName: {
      type: String,
      default: function () {
        return this.parent().resName;
      },
    },
  },
  {
    timestamps: true,
  }
);
const visitSchema = new mongoose.Schema({
  source: { type: String },
  timestamp: { type: Date, default: Date.now },
});
const locationSchema = new mongoose.Schema({
  lat: { type: Number },
  lng: { type: Number },
});

const newSchema = new mongoose.Schema(
  {
    profileImage: { type: String, required: true },
    profileImageId: { type: String },
    bgPhoto: { type: String },
    bgPhotoId: { type: String },
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
    pinLocation: locationSchema,
    openAt: { type: String },
    closeAt: { type: String },
    restoReview: [reviewSchema],
    visits: [visitSchema],
    isSubscribed: { type: String, default: "not subscribed" },
    menu: [menuSchema],
    tags: [{ type: String }],
    blogPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" }],
    postCount: { type: Number, default: 0 },
    paymentType: { type: String, default: "None" },
    subscriptionStartDate: {
      type: Date,
      default: null,
    },
    subscriptionEndDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, collection: "Restaurants" }
);
const Restaurant = mongoose.model("Restaurants", newSchema);
module.exports = Restaurant;
