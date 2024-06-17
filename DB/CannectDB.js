require('dotenv').config()

const mongoose = require("mongoose")

async function cannectDB(Url) {
  // process.env.mongoDB
  console.log("Posess in mongo");
  try {
    await  mongoose.connect(Url)
    console.log('MongoDB Cannect')
  } catch (error) {
    error => console.log("MongoDB not cannect",error)
  }
}

module.exports = cannectDB 