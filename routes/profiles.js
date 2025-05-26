 const express = require('express');
 const router = express.Router();
 const Profile = require('../models/Client');

 // Create profile (with Cloudinary image URL)
 router.post('/', async(req, res) => {
     try {
         const {
             name,
             profession,
             description,
             phoneNumber,
             whatsappLink,
             city,
             religion,
             imageUrl, // single Cloudinary image URL
             videoUrl // optional, if you later add Cloudinary video upload
         } = req.body;

         const profile = new Profile({
             name,
             profession,
             description,
             phoneNumber,
             whatsappLink,
             city,
             religion,
             images: [imageUrl], // wrap in array since your schema expects array
             video: videoUrl || ''
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

 // Get profile by ID
 router.get('/:id', async(req, res) => {
     try {
         const profile = await Profile.findById(req.params.id);
         if (!profile) return res.status(404).json({ message: 'Profile not found' });
         res.json(profile);
     } catch (err) {
         res.status(500).json({ message: 'Error fetching profile.' });
     }
 });

 // Update profile (still using Cloudinary URLs)
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
             imageUrl,
             videoUrl
         } = req.body;

         profile.name = name;
         profile.profession = profession;
         profile.description = description;
         profile.phoneNumber = phoneNumber;
         profile.whatsappLink = whatsappLink;
         profile.city = city;
         profile.religion = religion;
         profile.images = imageUrl ? [imageUrl] : profile.images;
         profile.video = videoUrl || profile.video;

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

         // No need to delete local files since we now use Cloudinary
         res.json({ message: 'Profile deleted' });
     } catch (err) {
         res.status(500).json({ message: 'Error deleting profile.' });
     }
 });

 module.exports = router;