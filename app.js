 const { MongoClient } = require('mongodb');
 const express = require('express');
 const cors = require('cors'); // Allow frontend to access backend
 const multer = require('multer');
 const { v2: cloudinary } = require('cloudinary');
 const { CloudinaryStorage } = require('multer-storage-cloudinary');

 const app = express();
 app.use(cors()); // Enable CORS
 app.use(express.json()); // For parsing JSON

 // MongoDB Setup
 const client = new MongoClient('mongodb://127.0.0.1:27017');
 const dbName = 'client_profiles';
 const collectionName = 'clients';
 let collection;

 // Cloudinary Config
 cloudinary.config({
     cloud_name: 'dm2jl0ddv', // <- replace with yours
     api_key: '523981893963279', // <- replace with your API key
     api_secret: 'Jus5GEsL0LhjbXA54V39AP9ijP0' // <- replace with your API secret
 });

 // Cloudinary Storage for Multer
 const storage = new CloudinaryStorage({
     cloudinary,
     params: {
         folder: 'malaya_profiles',
         allowed_formats: ['jpg', 'jpeg', 'png'],
     },
 });
 const upload = multer({ storage });

 // Cloudinary Upload Route
 app.post('/api/upload', upload.single('image'), (req, res) => {
     try {
         res.json({ imageUrl: req.file.path }); // Return Cloudinary URL
     } catch (err) {
         res.status(500).json({ error: 'Upload failed' });
     }
 });

 // Get all profiles
 app.get('/api/profiles', async(req, res) => {
     try {
         const documents = await collection.find().toArray();
         res.json(documents); // <-- Fixed typo: was `document`
     } catch (err) {
         res.status(500).send('Server error');
     }
 });

 // Start MongoDB and the server
 async function start() {
     try {
         await client.connect();
         const db = client.db(dbName);
         collection = db.collection(collectionName);
         console.log('Connected to MongoDB');

         app.listen(5000, () => {
             console.log('Server running at http://localhost:5000');
         });
     } catch (err) {
         console.error('MongoDB connection failed:', err);
     }
 }

 start();