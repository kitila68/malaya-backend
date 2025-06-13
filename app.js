const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Setup
const client = new MongoClient('mongodb://127.0.0.1:27017');
const dbName = 'client_profiles';
const collectionName = 'clients';
let collection;

// Multer Setup – store files temporarily
const upload = multer({ dest: 'uploads/' });

// ImgBB Upload Route
app.post('/api/upload', upload.single('image'), async(req, res) => {
    try {
        const imagePath = req.file.path;
        const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });

        const imgbbResponse = await axios.post('https://api.imgbb.com/1/upload', null, {
            params: {
                key: process.env.IMGBB_API_KEY,
                image: imageData,
            },
        });

        // Delete local file after upload
        fs.unlinkSync(imagePath);

        const imageUrl = imgbbResponse.data.data.url;
        res.json({ imageUrl });
    } catch (err) {
        console.error('Upload error:', err.message);
        res.status(500).json({ error: 'Image upload failed' });
    }
});

// Get all profiles
app.get('/api/profiles', async(req, res) => {
    try {
        const documents = await collection.find().toArray();
        res.json(documents);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Add a new profile
app.post('/api/profiles', async(req, res) => {
    try {
        const profile = req.body;
        const result = await collection.insertOne(profile);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).send('Failed to create profile');
    }
});

// Start MongoDB and server
async function start() {
    try {
        await client.connect();
        const db = client.db(dbName);
        collection = db.collection(collectionName);
        console.log('✅ Connected to MongoDB');

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`✅ Server running at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err);
    }
}

start();