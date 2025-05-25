 const express = require('express');
 const path = require('path');
 const cors = require('cors');
 const jwt = require('jsonwebtoken');
 const mongoose = require('mongoose');

 const app = express();
 const SECRET_KEY = 'your_super_secret_key';

 app.use(cors({
     origin: ['https://malaya-tz.com', 'https://malaya-tz.netlify.app'],
     credentials: true
 }));

 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));

 app.get('/', (req, res) => {
     res.send('✅Malaya backend is working');
 });

 const mongoURI = 'mongodb+srv://malaya_admin:malaya123@cluster0.ivomto5.mongodb.net/client_profiles?retryWrites=true&w=majority';

 mongoose.connect(mongoURI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
     })
     .then(() => console.log('✅ MongoDB Atlas connected successfully'))
     .catch(err => console.error('❌ MongoDB connection error:', err));

 app.post('/api/login', (req, res) => {
     const { username, password } = req.body;
     if (username === 'admin' && password === 'malaya123') {
         const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '2h' });
         return res.json({ token });
     }
     res.status(401).json({ message: 'Invalid credentials' });
 });

 const uploadPath = path.join(__dirname, 'public', 'upload');
 app.use('/upload', express.static(uploadPath));

 const profilesRouter = require('./routes/profiles');
 app.use('/api/profiles', profilesRouter);

 const PORT = process.env.PORT || 5000;
 app.listen(PORT, () => {
     console.log(`✅ Server running on port ${PORT}`);
 });