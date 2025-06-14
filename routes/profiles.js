const express = require('express');
const multer = require('multer');
const { ObjectId } = require('mongodb');

const router = express.Router();
const upload = multer(); // parse multipart/form-data

// Create a new profile
router.post('/', upload.none(), async(req, res) => {
    try {
        const collection = req.app.locals.collection;
        if (!collection) {
            console.error("❌ MongoDB collection not initialized");
            return res.status(500).json({ error: "Database not connected." });
        }

        const {
            name,
            profession,
            description,
            phoneNumber,
            whatsappLink,
            city,
            religion,
            age,
            weight,
            height,
            rating,
            video,
            images,
            vip,
            premium,
            isNew
        } = req.body;

        const newProfile = {
            name: name || '',
            profession: profession || '',
            description: description || '',
            phoneNumber: phoneNumber || '',
            whatsappLink: whatsappLink || '',
            city: city || '',
            religion: religion || '',
            age: parseInt(age) || null,
            weight: parseInt(weight) || null,
            height: parseInt(height) || null,
            rating: parseInt(rating) || null,
            video: typeof video === 'string' ? video : '',
            images: Array.isArray(images) ? images : (typeof images === 'string' ? [images] : []),
            vip: vip === 'true' || vip === true,
            premium: premium === 'true' || premium === true,
            isNew: isNew === 'true' || isNew === true,
            createdAt: new Date()
        };

        const result = await collection.insertOne(newProfile);
        res.status(201).json({ success: true, id: result.insertedId });

    } catch (err) {
        console.error("Error creating profile:", err);
        res.status(500).json({ message: 'Failed to create profile.' });
    }
});

// Get all profiles
router.get('/', async(req, res) => {
    try {
        const collection = req.app.locals.collection;
        if (!collection) {
            return res.status(500).json({ error: "Database not connected." });
        }

        const profiles = await collection.find().toArray();
        res.json(profiles);
    } catch (err) {
        console.error("Error fetching profiles:", err);
        res.status(500).json({ message: 'Failed to fetch profiles.' });
    }
});

// Get a single profile by ID
router.get('/:id', async(req, res) => {
    try {
        const collection = req.app.locals.collection;
        if (!collection) {
            return res.status(500).json({ error: "Database not connected." });
        }

        const profile = await collection.findOne({ _id: new ObjectId(req.params.id) });
        if (!profile) return res.status(404).json({ message: 'Profile not found' });

        res.json(profile);
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ message: 'Error fetching profile.' });
    }
});

// Update a profile
router.put('/:id', async(req, res) => {
    try {
        const collection = req.app.locals.collection;
        if (!collection) {
            return res.status(500).json({ error: "Database not connected." });
        }

        const updateFields = {...req.body };

        if (req.body.images) {
            updateFields.images = Array.isArray(req.body.images) ?
                req.body.images :
                [req.body.images];
        }

        const result = await collection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: updateFields });

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ message: 'Error updating profile.' });
    }
});

// Delete a profile
router.delete('/:id', async(req, res) => {
    try {
        const collection = req.app.locals.collection;
        if (!collection) {
            return res.status(500).json({ error: "Database not connected." });
        }

        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json({ message: 'Profile deleted successfully' });
    } catch (err) {
        console.error("Error deleting profile:", err);
        res.status(500).json({ message: 'Error deleting profile.' });
    }
});

module.exports = router;