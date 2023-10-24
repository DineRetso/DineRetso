const express = require("express");
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const { isAuth } = require("../utils");
const Restaurant = require("../Models/Restaurant_Model.js");

dotenv.config();
const imageRouter = express.Router();
const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } });

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

//uploadVideo
imageRouter.post("/video", isAuth, upload.single("file"), async (req, res) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_API,
    secure: true,
  });

  const streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "video" },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  try {
    const result = await streamUpload(req);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload video" });
  }
});

//imageDelete
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

//videoDelete
imageRouter.delete("/video/delete/:public_id", async (req, res) => {
  const public_id = req.params.public_id;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_API,
    secure: true,
  });
  try {
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: "video",
    });

    if (result.result === "ok") {
      res.json({ message: "Video deleted successfully" });
    } else {
      res.status(500).json({ error: "Failed to delete video" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete video" });
  }
});

imageRouter.post(
  "/:restaurantId",
  isAuth,
  upload.single("file"),
  async (req, res) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_API,
      secure: true,
    });
    const restaurantId = req.params.restaurantId;

    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          async (error, result) => {
            if (result) {
              try {
                const restaurant = await Restaurant.findById(restaurantId);
                if (restaurant) {
                  restaurant.bgPhoto = result.secure_url;
                  await restaurant.save();
                  resolve(result);
                } else {
                  reject(new Error("Restaurant not found"));
                }
              } catch (error) {
                reject(error);
              }
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req);
    res.send(result);
  }
);

imageRouter.post(
  "/multiple",
  isAuth,
  upload.array("images[]", 5),
  async (req, res) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_API,
      secure: true,
    });

    try {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          });
          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      });

      const results = await Promise.all(uploadPromises);
      res.send(results);
    } catch (error) {
      console.error(error);
      res.status(500).send("Image upload failed.");
    }
  }
);

module.exports = imageRouter;
