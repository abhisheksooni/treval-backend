const mongoose = require("mongoose")

const createTrips = new mongoose.Schema({
    packageName: {
        type: String
    },
    price: {
        type: String
    },
    packageLoctionName: {
        type: String
    },
    description: {
        type: String
    },
    schedule: {
        type: String
    },
    dayAndNight: {
        type: String
    },
    cloudinary_id: {
        type: String
    },
    thumbnail: {
        type: String
    },
    // images:[
    //     {
    //         url:String,
    //         caption:String
    //     }
    // ]
}, { timestamps: true })


const createTour = mongoose.model("createtour", createTrips);

module.exports = createTour