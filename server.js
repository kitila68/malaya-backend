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

 // ✅ Serve static frontend files
 const frontendPath = path.join(__dirname, '..', 'frontend');
 app.use(express.static(frontendPath));

 // ✅ Serve sitemap.xml
 app.get('/sitemap.xml', (req, res) => {
     res.sendFile(path.join(frontendPath, 'sitemap.xml'));
 });

 // ✅ MongoDB Atlas connection
 const mongoURI = 'mongodb+srv://malaya_admin:malaya123@cluster0.ivomto5.mongodb.net/client_profiles?retryWrites=true&w=majority';

 mongoose.connect(mongoURI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
     })
     .then(() => console.log('✅ MongoDB Atlas connected successfully'))
     .catch(err => console.error('❌ MongoDB connection error:', err));

 // ✅ Admin login
 app.post('/api/login', (req, res) => {
     const { username, password } = req.body;
     if (username === 'admin' && password === 'malaya123') {
         const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '2h' });
         return res.json({ token });
     }
     res.status(401).json({ message: 'Invalid credentials' });
 });

 // ✅ Serve uploaded files from /public/upload
 const uploadPath = path.join(__dirname, 'public', 'upload');
 app.use('/upload', express.static(uploadPath));

 // ✅ Profiles route
 const profilesRouter = require('./routes/profiles');
 app.use('/api/profiles', profilesRouter);

 // ✅ Start server
 const PORT = process.env.PORT || 5000;
 app.listen(PORT, () => {
     console.log(`✅ Server running on port ${PORT}`);
 });