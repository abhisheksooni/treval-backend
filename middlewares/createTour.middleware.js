const cloudinary = require('cloudinary').v2;
const fs = require("fs")
const multer = require('multer');
const path = require('path');

const createTour = require("../Models/createTour.model.js")


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});







const fileupload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads")
      },
      filename: function (res, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname) +".png" )
      }
    })
  }).any("filedata",);
  
  
  // Middleware to upload file to Cloudinary
  const uploadToCloudinary = async (req, res, next) => {
    // if (!req.file) {
    //   return next(new Error("No file uploaded"));
    // }
  
    try {



      const promises = req.files.map( async (file)=>{

        const uploadImages = []

        const result = await cloudinary.uploader.upload(file.path,{folder:"treval-images"})
    
        // const imgObject = {
        //   url:result.secure_url,
        //   caption:req.body.captions && req.body.captions[file.filename] ? req.body.captions[file.filename] : ''
        // }

        // uploadImages.push(imgObject)

      // const shortId = ShortId.generate();
      const { packageName , packageLoctionName, dayAndNight, price, schedule, description,cloudinary_id , thumbnail,} = req.body;

          // save image detail to moongoDB
      // const filess = res.file
      // Create the tour
      const newImage =  createTour.create({
          packageName,
          packageLoctionName,
          dayAndNight,
          price,
          schedule,
          description,
          cloudinary_id:result.public_id,
          thumbnail:result.secure_url,
      });

       // Save the tour document
      //  await newImage.save();


      res.status(201).json({ message: "Tour created successfully." });
   

    // Store Cloudinary URL in req object
    req.cloudinaryUrl = result.secure_url;
    
    // Delete file from uploads directory
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error(err);
      }
    });

    console.log("File",file.path);
    // Wait for all uploads and database saves to complete
    await Promise.all(promises);
    next();
    
  })

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }

  };




  module.exports = {fileupload,uploadToCloudinary}