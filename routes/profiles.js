const express = require('express');
const path = require('path');
const router = express.Router();
const upload = require('../middlewares/upload');
const Client = require('../models/Client');

// POST - Add new profile
router.post('/', upload.array('images', 5), async(req, res) => {
    try {
        const {
            name,
            profession,
            description,
            phoneNumber,
            whatsappLink,
            city,
            religion,
            video
        } = req.body;

        const imagePaths = req.files.map(file => file.filename);

        const newClient = new Client({
            name,
            profession,
            description,
            phoneNumber,
            whatsappLink,
            city,
            religion,
            images: imagePaths,
            video
        });

        const savedClient = await newClient.save();
        res.status(201).json(savedClient);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to upload profile.' });
    }
});

// GET - List all profiles
router.get('/', async(req, res) => {
    try {
        const clients = await Client.find().sort({ createdAt: -1 });
        res.json(clients);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profiles' });
    }
});

// GET - One profile by ID
router.get('/:id', async(req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) return res.status(404).json({ error: 'Profile not found' });
        res.json(client);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// PUT - Update profile by ID
router.put('/:id', upload.array('images', 5), async(req, res) => {
    try {
        const {
            name,
            profession,
            description,
            phoneNumber,
            whatsappLink,
            city,
            religion,
            video
        } = req.body;

        const client = await Client.findById(req.params.id);
        if (!client) return res.status(404).json({ error: 'Profile not found' });

        client.name = name;
        client.profession = profession;
        client.description = description;
        client.phoneNumber = phoneNumber;
        client.whatsappLink = whatsappLink;
        client.city = city;
        client.religion = religion;
        client.video = video;

        // Replace images if new ones uploaded
        if (req.files && req.files.length > 0) {
            client.images = req.files.map(file => file.filename);
        }

        const updated = await client.save();
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// DELETE - Remove profile
router.delete('/:id', async(req, res) => {
    try {
        const result = await Client.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Profile not found' });
        res.json({ message: 'Profile deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete profile' });
    }
});

module.exports = router;