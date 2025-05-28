 const mongoose = require('mongoose');

 const clientSchema = new mongoose.Schema({
     name: { type: String, required: true },
     profession: { type: String, required: true },
     description: { type: String },
     phoneNumber: { type: String },
     whatsappLink: { type: String },
     city: { type: String, required: true },
     religion: { type: String },
     images: [{ type: String }],
     video: { type: String },
     height: { type: Number }, // in cm
     weight: { type: Number }, // in kg
     age: { type: Number }
 }, { timestamps: true });

 module.exports = mongoose.model('Client', clientSchema);