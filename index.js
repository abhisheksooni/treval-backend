require('dotenv').config()
const express = require("express")
const app = express()

const cookie =require("cookie-parser")
const fs = require("fs")
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const cannectDB = require("./DB/CannectDB.js")
const adminUser = require("./Models/user.model.js")
const {fileupload,uploadToCloudinary} = require("./middlewares/createTour.middleware.js")
const {getAllTour,getFindOne,createPakeage, createAndLogin,DeleteOnePakeage, UpdateOnePakeage} = require("./Controllers/tours.controllers.js")

// cloudinaty config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});


// DB cannect
cannectDB(process.env.mongoDB)


app.use(express.urlencoded({extended:false}))
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Origin', 'https://treval-backend.onrender.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });


 


app.get("/", async(req,res)=>{
// cloudinary.search.expression(
//   'folder:treval-images/*' // add your folder
//   ).sort_by('public_id','desc').max_results(30).execute().then(result=>res.send(result)); 
const result = await cloudinary.api.resources({type:"upload",prefix:"",max_results:30}) 

// console.log(result.resources);
res.send(result.resources)
// res.send(result)
})

app.get("/getall",getAllTour)

app.get("/getOne/:id",getFindOne)

app.post("/create-tour",fileupload,uploadToCloudinary)

app.delete("/delete/:id",DeleteOnePakeage)
app.post("/tour_update/:id",fileupload,UpdateOnePakeage)
// uploadToCloudinary
app.post("/upload",fileupload,uploadToCloudinary,(req,res)=>{
    res.send("Upload done")
})


app.post("/shinup",createAndLogin)

app.listen(process.env.PORT, ()=>console.log(`Sever start in ${process.env.PORT}`))