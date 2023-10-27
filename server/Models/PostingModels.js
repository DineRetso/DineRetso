const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
  public_id: String,
  secure_url: String,
});
const videoSchema = new mongoose.Schema({
  public_id: String,
  secure_url: String,
});

const visitSchema = new mongoose.Schema({
  source: { type: String },
  timestamp: { type: Date, default: Date.now },
});
const blogPostSchema = new mongoose.Schema(
  {
    resName: { type: String, required: true },
    resId: { type: String, required: true },
    address: { type: String, required: true },
    fbLink: { type: String },
    igLink: { type: String },
    webLink: { type: String },
    category: { type: String, required: true },
    status: { type: String },
    visits: [visitSchema],
    expectedVisit: { type: Number, default: 0 },
    tags: [{ type: String }],
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [imageSchema],
    video: videoSchema,
  },
  {
    timestamps: true,
  }
);

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = BlogPost;
