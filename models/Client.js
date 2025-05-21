const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: String,
    profession: String,
    description: String,
    phoneNumber: String,
    whatsappLink: String,
    city: String,
    religion: String,
    images: [String],
    video: String
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);