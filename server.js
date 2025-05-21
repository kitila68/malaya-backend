 const express = require('express');
 const path = require('path');
 const cors = require('cors');
 const jwt = require('jsonwebtoken');
 const mongoose = require('mongoose');

 const app = express();
 const SECRET_KEY = 'your_super_secret_key';

 // Middleware
 app.use(cors());
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));

 // ✅ FIXED: Serve static frontend files from new folder name
 app.use(express.static(path.join(__dirname, '..', 'frontend')));

 // MongoDB setup
 mongoose.connect('mongodb://localhost:27017/client_profiles', {
         useNewUrlParser: true,
         useUnifiedTopology: true,
     })
     .then(() => console.log('MongoDB connected successfully'))
     .catch(err => console.error('MongoDB connection error:', err));

 // Login route
 app.post('/api/login', (req, res) => {
     const { username, password } = req.body;
     if (username === 'admin' && password === 'malaya123') {
         const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '2h' });
         return res.json({ token });
     }
     res.status(401).json({ message: 'Invalid credentials' });
 });

 // Serve uploads folder
 app.use('/upload', express.static('uploads'));

 // Profiles API route
 const profilesRouter = require('./routes/profiles');
 app.use('/api/profiles', profilesRouter);

 // Optional SPA fallback (uncomment if using frontend routing like React/Vue)
 // app.get('*', (req, res) => {
 //   res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
 // });

 // Start server
 const PORT = 5000;
 app.listen(PORT, () => {
     console.log(`✅ Server running at http://localhost:${PORT}`);
 });