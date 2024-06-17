// server.js

const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');  
const path = require('path');

const app = express();
const port = 3001;

// Connect to MongoDB (replace 'your_database_url' with your actual MongoDB URL)
mongoose.connect('mongodb://localhost:27017/your_database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Configure Cloudinary with your cloud name, API key, and API secret
cloudinary.config({
  cloud_name: 'YOUR_CLOUD_NAME',
  api_key: 'YOUR_API_KEY',
  api_secret: 'YOUR_API_SECRET'
});

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// MongoDB schema and model
const ImageSchema = new mongoose.Schema({
  name: String,
  cloudinary_id: String,
  url: String,
  createdAt: { type: Date, default: Date.now }
});

const Image = mongoose.model('Image', ImageSchema);

// Route to handle file upload
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { folder: 'uploads' });

    // Save image details to MongoDB
    const newImage = new Image({
      name: req.file.originalname,
      cloudinary_id: result.public_id,
      url: result.secure_url
    });

    await newImage.save();

    // Respond with success message
    res.json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});






      // cloudinary.uploader.multi
          // Upload to Cloudinary  cloudinary.uploader.upload(req.file.path,{folder:"treval-images"}, (error, result)
  // const result = await  cloudinary.uploader.upload(req.file.path,{folder:"treval-images"}, (error, result) => {
     

     
      



  //     // const shortId = ShortId.generate();
  //     const { packageName , packageLoctionName, dayAndNight, price, schedule, description,cloudinary_id , thumbnail} = req.body;

  //         // save image detail to moongoDB
  //     // const file = res.file
  //     // Create the tour
  //     const newImage =  createTour.create({
  //         packageName,
  //         packageLoctionName,
  //         dayAndNight,
  //         price,
  //         schedule,
  //         description,
  //         cloudinary_id:result.public_id,
  //         thumbnail:result.secure_url,
          
  //     });

  //     res.status(201).json({ message: "Tour created successfully." });
   

  //   // Store Cloudinary URL in req object
  //   req.cloudinaryUrl = result.secure_url;
    
  //   // Delete file from uploads directory
  //   fs.unlink(req.file.path, (err) => {
  //     if (err) {
  //       console.error(err);
  //     }
  //   });
  //   next();
  // });