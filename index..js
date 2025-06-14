const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const SECRET_KEY = process.env.SECRET_KEY || 'your_super_secret_key';

// Enable CORS for frontend domains
app.use(cors({
    origin: ['https://malaya-tz.com', 'https://malaya-tz.netlify.app'],
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic homepage test
app.get('/', (req, res) => {
    res.send('✅ Malaya backend is working');
});

// MongoDB Atlas connection
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://malaya_admin:malaya123@cluster0.ivomto5.mongodb.net/client_profiles?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('✅ MongoDB Atlas connected successfully'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Admin login route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'malaya123') {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '2h' });
        return res.json({ token });
    }
    res.status(401).json({ message: 'Invalid credentials' });
});

// Serve uploaded images
const uploadPath = path.join(__dirname, 'public', 'upload');
app.use('/upload', express.static(uploadPath));

// Routes
const profilesRouter = require('./routes/profiles');
const uploadRouter = require('./routes/upload');

app.use('/api/profiles', profilesRouter);
app.use('/api/upload', uploadRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});