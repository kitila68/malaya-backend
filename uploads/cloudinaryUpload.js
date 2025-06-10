//const express = require("express");
//const multer = require("multer");
//const { v2: cloudinary } = require("cloudinary");
//const { CloudinaryStorage } = require("multer-storage-cloudinary");

//const router = express.Router();

// Configure Cloudinary
//cloudinary.config({
//  cloud_name: "dm2jl0ddv",
//api_key: "523981893963279",
// api_secret:"Jus5GEsL0LhjbXA54V39AP9ijP0",
//});

// Set up Cloudinary storage
//const storage = new CloudinaryStorage({
//  cloudinary,
//params: {
//  folder: "malaya_profiles", // Cloudinary folder
//allowed_formats: ["jpg", "jpeg", "png"],
//},
// });

//const upload = multer({ storage });

// POST route to upload image
//router.post("/", upload.single("image"), (req, res) => {
//  res.json({ imageUrl: req.file.path });
//});

//module.exports = router;