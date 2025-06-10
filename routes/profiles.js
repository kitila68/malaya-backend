const express = require('express');
const router = express.Router();
const Profile = require('../models/Client');

// Create a new profile
// Create a new profile
router.post('/', async(req, res) => {
    console.log("Incoming Profile Data:", req.body); // ✅ LOGGING for debugging

    try {
        const {
            name,
            profession,
            description,
            phoneNumber,
            whatsappLink,
            city,
            religion,
            images,
            video
        } = req.body;

        // ✅ Ensure images is always an array
        let safeImages = [];
        if (Array.isArray(images)) {
            safeImages = images;
        } else if (typeof images === 'string') {
            safeImages = [images]; // convert single string to array
        }

        // ✅ Ensure video is a string (or empty)
        const safeVideo = typeof video === 'string' ? video : '';

        const profile = new Profile({
            name: name || '',
            profession: profession || '',
            description: description || '',
            phoneNumber: phoneNumber || '',
            whatsappLink: whatsappLink || '',
            city: city || '',
            religion: religion || '',
            images: safeImages,
            video: safeVideo
        });

        const savedProfile = await profile.save();
        res.status(201).json(savedProfile);

    } catch (err) {
        console.error("Error creating profile:", err); // ✅ log full error
        res.status(500).json({ message: 'Failed to create profile.' });
    }
});

// Get all profiles
router.get('/', async(req, res) => {
    try {
        const profiles = await Profile.find();
        res.json(profiles);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch profiles.' });
    }
});

// Get a single profile by ID
router.get('/:id', async(req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) return res.status(404).json({ message: 'Profile not found' });
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching profile.' });
    }
});

// Update a profile
router.put('/:id', async(req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) return res.status(404).json({ message: 'Profile not found' });

        const {
            name,
            profession,
            description,
            phoneNumber,
            whatsappLink,
            city,
            religion,
            images,
            video
        } = req.body;

        profile.name = name;
        profile.profession = profession;
        profile.description = description;
        profile.phoneNumber = phoneNumber;
        profile.whatsappLink = whatsappLink;
        profile.city = city;
        profile.religion = religion;
        profile.images = Array.isArray(images) ? images : profile.images;
        profile.video = video || profile.video;

        const updated = await profile.save();
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Error updating profile.' });
    }
});

// Delete a profile
router.delete('/:id', async(req, res) => {
    try {
        const profile = await Profile.findByIdAndDelete(req.params.id);
        if (!profile) return res.status(404).json({ message: 'Profile not found' });

        res.json({ message: 'Profile deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting profile.' });
    }
});

module.exports = router;