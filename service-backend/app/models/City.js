require("dotenv").config();
const mongoose = require('mongoose'),
    Schema = mongoose.Schema
 

// just using this model to fetch cities and make auto-complete faster by relying on mongo db
const CitySchema = new Schema({
 
    "id": {type: Number,  index: true },
    "name": { type: String,  index: true },
    "state": String,
    "country": String,
    "coord": {
    }
  
}, {
    timestamps: true
});



const City = mongoose.model("City", CitySchema)

module.exports = City
