 const multer = require('multer');
 const path = require('path');

 // Storage setup
 const storage = multer.diskStorage({
     destination: function(req, file, cb) {
         cb(null, 'uploads/');
     },
     filename: function(req, file, cb) {
         cb(null, Date.now() + path.extname(file.originalname));
     }
 });

 // Allow multiple image files
 const upload = multer({ storage: storage });

 module.exports = upload;