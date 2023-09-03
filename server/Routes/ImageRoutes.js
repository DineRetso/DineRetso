const express = require("express");
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const { isAuth } = require("../utils");

dotenv.config();
const imageRouter = express.Router();
const upload = multer();

imageRouter.post("/", isAuth, upload.single("file"), async (req, res) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_API,
    secure: true,
  });
  const streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };
  const result = await streamUpload(req);
  res.send(result);
});

imageRouter.delete("/:public_id", isAuth, async (req, res) => {
  const public_id = req.params.public_id; // Extract the public_id from the URL parameter

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_API,
    secure: true,
  });

  try {
    const deletionResult = await cloudinary.uploader.destroy(public_id); // Use the extracted public_id for deletion
    res.send(deletionResult);
  } catch (error) {
    res.status(500).send("Image deletion failed.");
  }
});

module.exports = imageRouter;
