require('dotenv').config()

const express = require("express")
const app = express()

const cookie =require("cookie-parser")

const cannectDB = require("./DB/CannectDB.js")
const adminUser = require("./Models/user.model.js")


const {getAllTour,getFindOne,postTour, createAndLogin} = require("./Controllers/tours.controllers.js")
const multer = require('multer')

// DB cannect
cannectDB(process.env.mongoDB)

app.use(express.urlencoded({extended:false}))
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

app.get("/",(req,res)=>{
    res.send("get")
})

app.get("/getall",getAllTour)
app.get("/getOne/:id",getFindOne)


app.post("/create-tour",postTour)

const fileupload = multer({
  storage:multer.diskStorage({
    destination:function (req,file,cb){
      cb(null,"uploads")
    },
    filename:function(res,file,cb){
      cb(null,file.fieldname +"-" + Date.now() +".jpg")
    }
  })
}).single("filedata")


app.post("/upload",fileupload,(req,res)=>{
    res.send("Upload done")
})

app.post("/shinup",createAndLogin)

app.listen(process.env.PORT, ()=>console.log(`Sever start in ${process.env.PORT}`))