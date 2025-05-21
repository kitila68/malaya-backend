const { MongoClient } =
require('mongodb');
const express = require('express');
const cors = require('cors'); // Allow frontend to access backend

const app = express();

app.use(cors()); // Enable CORS

app.use(express.json()); // For parsing JSON

const client = new
MongoClient('mongodb://127.0.0.1:27017');

const dbName = 'client_profiles';
const collectionName = 'clients';

let collection;

// Start MongoDB and the server
async function start() {
    try {
        await client.connect();
        const db = client.db(dbName);
        collection =
            db.collection(collectionName);
        console.log('Connected to MongoDB');

        // Start the server
        app.listen(5000, () => {
            console.log('Server running at http://localhost:5000');
        });
    } catch (err) {
        console.error('MongoDB connection failed:', err);
    }
}

// API Route to get all profiles
app.get('/api/profiles', async(req, res) => {
    try {
        const documents = await
        collection.find().toArray();
        res.json(document);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

start();