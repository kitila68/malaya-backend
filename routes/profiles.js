 const express = require('express');
 const router = express.Router();
 const multer = require('multer');
 const path = require('path');
 const fs = require('fs');
 const Profile = require('../models/client');

 // Set up multer for file uploads
 const storage = multer.diskStorage({
     destination: function(req, file, cb) {
         cb(null, path.join(__dirname, '../public/upload'));
     },
     filename: function(req, file, cb) {
         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
         cb(null, uniqueSuffix + '-' + file.originalname);
     }
 });
 const upload = multer({ storage: storage });

 // Create new profile
 router.post('/', upload.fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]), async(req, res) => {
     try {
         const images = req.files['images'] ?
             req.files['images'].map(function(file) { return file.filename; }) : [];

         const video = req.files['video'] && req.files['video'][0] ?
             req.files['video'][0].filename :
             '';

         const profile = new Profile({
             name: req.body.name,
             profession: req.body.profession,
             description: req.body.description,
             phoneNumber: req.body.phoneNumber,
             whatsappLink: req.body.whatsappLink,
             city: req.body.city,
             religion: req.body.religion,
             images: images,
             video: video
         });

         const savedProfile = await profile.save();
         res.status(201).json(savedProfile);
     } catch (err) {
         console.error(err);
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

 // Get a single profile
 router.get('/:id', async(req, res) => {
     try {
         const profile = await Profile.findById(req.params.id);
         if (!profile) return res.status(404).json({ message: 'Profile not found' });
         res.json(profile);
     } catch (err) {
         res.status(500).json({ message: 'Error fetching profile.' });
     }
 });

 // Update profile
 router.put('/:id', upload.fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]), async(req, res) => {
     try {
         const profile = await Profile.findById(req.params.id);
         if (!profile) return res.status(404).json({ message: 'Profile not found' });

         const newImages = req.files['images'] ?
             req.files['images'].map(function(file) { return file.filename; }) : [];

         const newVideo = req.files['video'] && req.files['video'][0] ?
             req.files['video'][0].filename :
             profile.video;

         profile.name = req.body.name;
         profile.profession = req.body.profession;
         profile.description = req.body.description;
         profile.phoneNumber = req.body.phoneNumber;
         profile.whatsappLink = req.body.whatsappLink;
         profile.city = req.body.city;
         profile.religion = req.body.religion;
         profile.images = newImages.length > 0 ? newImages : profile.images;
         profile.video = newVideo;

         const updated = await profile.save();
         res.json(updated);
     } catch (err) {
         res.status(500).json({ message: 'Error updating profile.' });
     }
 });

 // Delete profile
 router.delete('/:id', async(req, res) => {
     try {
         const profile = await Profile.findByIdAndDelete(req.params.id);
         if (!profile) return res.status(404).json({ message: 'Profile not found' });

         // Optionally delete files from server
         profile.images.forEach(filename => {
             const filePath = path.join(__dirname, '../public/upload', filename);
             if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
         });

         if (profile.video) {
             const videoPath = path.join(__dirname, '../public/upload', profile.video);
             if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
         }

         res.json({ message: 'Profile deleted' });
     } catch (err) {
         res.status(500).json({ message: 'Error deleting profile.' });
     }
 });

 module.exports = router;