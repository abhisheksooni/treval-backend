const {v2} = require("cloudinary");

const fs = require("fs")


v2.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});



const uploadOn = async (localFilePath) =>{
    try {
        if(!localFilePath) return null;
        //upload
      const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })

            // file has bing uploled
            console.log("file uploded Done",response.url)
            return response
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locla seve 
        return null
    }
}




  // Upload an image
  const uploadResult = await v2.uploader.upload("https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg", {
    public_id: "shoes"
}).catch((error)=>{console.log(error)});

console.log(uploadResult);







// Middleware to upload file to Cloudinary
const uploadToCloudinary = (req, res, next) => {
    if (!req.file) {
      return next(new Error("No file uploaded"));
    }
  
    // Upload to Cloudinary
    cloudinary.uploader.upload(req.file.path, (error, result) => {
      if (error) {
        return next(error);
      }
      
  
      // Store Cloudinary URL in req object
      req.cloudinaryUrl = result.secure_url;
      
      // Delete file from uploads directory
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error(err);
        }
      });
      next();
    });
  };
  
  