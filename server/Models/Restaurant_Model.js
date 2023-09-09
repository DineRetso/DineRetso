const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    index: { type: Number, required: true },
    image: { type: String },
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const menuSchema = new mongoose.Schema(
  {
    index: { type: Number, required: true },
    menuImage: { type: String },
    menuName: { type: String, required: true },
    description: { type: String },
    isAvailable: { type: Boolean, default: true, required: true },
    price: { type: Number, required: true },
    menuReview: [reviewSchema],
    classification: { type: String },
  },
  {
    timestamps: true,
  }
);
reviewSchema.pre("save", async function (next) {
  if (this.isNew) {
    const maxIndexReview = await this.constructor
      .findOne({}, { index: 1 })
      .sort({ index: -1 })
      .exec();

    this.index = maxIndexReview ? maxIndexReview.index + 1 : 1;
  }
  next();
});

menuSchema.pre("save", async function (next) {
  if (this.isNew) {
    const maxIndexMenu = await this.constructor
      .findOne({}, { index: 1 })
      .sort({ index: -1 })
      .exec();

    this.index = maxIndexMenu ? maxIndexMenu.index + 1 : 1;
  }
  next();
});

const newSchema = new mongoose.Schema(
  {
    profileImage: { type: String, required: true },
    bgPhoto: { type: String },
    resName: { type: String, required: true },
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
    visits: { type: Number, default: 0 },
    menu: [menuSchema],
    subscriptionStatus: {
      type: String,
      enum: ["subscribed", "not subscribed", "expired"],
      default: "not subscribed",
    },
  },
  { timestamps: true, collection: "Restaurants" }
);
const Restaurant = mongoose.model("Restaurants", newSchema);
module.exports = Restaurant;
