 const express = require('express');
 const cors = require('cors');
 const { MongoClient } = require('mongodb');
 const profilesRouter = require('./routes/profiles'); // Make sure path is correct
 const app = express();

 app.use(cors());
 app.use(express.json());

 // MongoDB Setup
 const mongoUrl = 'mongodb://127.0.0.1:27017';
 const dbName = 'client_profiles';
 const collectionName = 'clients';

 async function startServer() {
     try {
         const client = new MongoClient(mongoUrl);
         await client.connect();
         console.log('✅ Connected to MongoDB');

         const db = client.db(dbName);
         const collection = db.collection(collectionName);
         app.locals.collection = collection; // Expose collection to routes

         // Mount routes
         app.use('/api/profiles', profilesRouter);

         // Start server
         const PORT = process.env.PORT || 5000;
         app.listen(PORT, () => {
             console.log(`🚀 Server running at http://localhost:${PORT}`);
         });
     } catch (err) {
         console.error('❌ MongoDB connection failed:', err);
     }
 }

 startServer();