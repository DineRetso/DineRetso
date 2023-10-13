const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema(
  {
    resName: { type: String, required: true },
    address: { type: String, required: true },
    fbLink: { type: String },
    igLink: { type: String },
    webLink: { type: String },
    category: { type: String, required: true },
    visits: { type: Number, default: 0 },
    tags: [{ type: String }],
    stat: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = BlogPost;
