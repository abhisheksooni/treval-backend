const createTour = require("../Models/createTour.model.js")
const User = require("../Models/user.model.js")
const ShortId = require('shortid')
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')



const cloudinary = require('cloudinary').v2;
const fs = require("fs")
const multer = require('multer');
const { fileupload } = require("../middlewares/createTour.middleware.js");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});




// get all
const getAllTour = async (req, res) => {

    const allTours = await createTour.find({})
    res.status(200).json(allTours)
    // res.send( allTours)
}

// find one
const getFindOne = async (req, res) => {
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
const createPakeage = async (req, res) => {

    try {
        const shortId = ShortId.generate();
        const { packageName, packageLoctionName, dayAndNight, price, schedule, description, cloudinary_id, url, images } = req.body;

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

const createAndLogin = async (req, res) => {
    try {
        const { username, email, password } = req.body;
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
const DeleteOnePakeage = async (req, res) => {
    try {
        const findId = req.params.id;
        const md = await createTour.findById(findId)
        const public_id = md.cloudinary_id;
        const imgcolud =  cloudinary.uploader.destroy(public_id)
        const Tour = await createTour.findOneAndDelete(
            { _id: findId },
        )
        res.send({ "Delete done": findId })

    } catch (error) {

    }
}
// const result = await cloudinary.uploader.upload(file.path,{folder:"treval-images"})
// Create a New Tour Pakeage
const UpdateOnePakeage = async (req, res) => {
    try {
        const findId = req.params.id;

        // Check if the document exists in MongoDB
        const existingTour = await createTour.findById(findId);
        // if (!existingTour) {
        //     return res.status(404).send({ error: `Document with id ${findId} not found in MongoDB` });
        // }

        // Update the document in MongoDB
        const { packageName, packageLocationName, dayAndNight, price, schedule, description, images } = req.body;

        // Upload new image to Cloudinary (if needed)
        let resultUploadImg = {};
        if (req.files && req.files.path) {
          let  resultUploadImg = await cloudinary.uploader.upload(req.files.path, { folder: "travel-images" });
        }

        // Construct update object
        const updateObject = {
            packageName,
            packageLocationName,
            dayAndNight,
            price,
            schedule,
            description,
        };

        // Add cloudinary_id and url if new image was uploaded
        if (resultUploadImg.public_id && resultUploadImg.secure_url) {
            updateObject.cloudinary_id = resultUploadImg.public_id;
            updateObject.url = resultUploadImg.secure_url;
        }

        // Perform the update operation
        const updatedTour = await createTour.findOneAndUpdate(
            { _id: findId },
            updateObject,
            // { new: true } // To return the updated document
        );

        if (!updatedTour) {
            return res.status(404).send({ error: `Failed to update document with id ${findId}` });
        }

        res.send({ message: "Update done", updatedTour });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
   
   

}


module.exports = { getAllTour, getFindOne, createPakeage, createAndLogin, DeleteOnePakeage,UpdateOnePakeage }
