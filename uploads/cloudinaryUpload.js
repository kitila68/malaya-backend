const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: "dm2jj0ddv",
    api_key: "YOUR_API_KEY",
    api_secret: "YOUR_API_SECRET",
});

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "malaya_profiles", // Cloudinary folder
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});

const upload = multer({ storage });

// POST route to upload image
router.post("/", upload.single("image"), (req, res) => {
    res.json({ imageUrl: req.file.path });
});

module.exports = router;