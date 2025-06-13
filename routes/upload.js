const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/', upload.single('image'), async(req, res) => {
    try {
        const filePath = req.file.path;
        const imageBase64 = fs.readFileSync(filePath, { encoding: 'base64' });

        const response = await axios.post('https://api.imgbb.com/1/upload', null, {
            params: {
                key: process.env.IMGBB_API_KEY,
                image: imageBase64,
            }
        });

        fs.unlinkSync(filePath); // delete file after upload

        res.json({ url: response.data.data.url });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Image upload failed' });
    }
});

module.exports = router;