const createTour = require("../Models/createTour.model.js")
const User = require("../Models/user.model.js")
const ShortId = require('shortid')
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')



// const cloudinary = require('cloudinary').v2;
// const fs = require("fs")
// const multer = require('multer');

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true,
// });




// get all
const getAllTour = async (req,res)=>{
    
const allTours = await createTour.find({})
res.status(200).json(allTours)
// res.send( allTours)
}

// find one
const getFindOne = async (req,res)=>{
    try {
        const findShortId = req.params.id;
        console.log(findShortId);
        const entry = await createTour.findOne({ _id: findShortId });
       
        res.send(entry)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }

}








// POST : Create a New Tour Pakeage
const createPakeage = async (req,res)=>{

    try {
        const shortId = ShortId.generate();
        const { packageName , packageLoctionName, dayAndNight, price, schedule, description,cloudinary_id,url,images} = req.body;

        // const file = res.file
        // Create the tour
        await createTour.create({
            packageName,
            packageLoctionName,
            dayAndNight,
            price,
            schedule,
            description,
            cloudinary_id,
            url,
            images
        });

        res.status(201).json({ message: "Tour created successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// create admin

const createAndLogin = async(req,res)=>{
    try {
        const {username,email,password} = req.body;
        await User.create({
            username,
            email,
            password,
        })

        // let token = jwt.sign({email}, "shhhhhhh")
        // res.cookieParser("token",token)

        res.status(201).json({ message: "Created Account" });
        // res.send({ message: "Created Account" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
  
    
}

// Create a New Tour Pakeage
// const createPakeage =  async(res,res)=>{

// } 


module.exports = {getAllTour,getFindOne,createPakeage,createAndLogin}