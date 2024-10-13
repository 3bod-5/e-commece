const mongoose = require("mongoose")
const connect = mongoose.connect("mongodb://127.0.0.1:27017/e-commerce")
var Schema = mongoose.Schema;
connect.then(() =>{
    console.log("Database connected succefuly")
}).catch(() => {
    console.log("Database cannot connect")
})
const selledItems = new mongoose.Schema({
    name:{
        type:String
    },
    price:{
        type:Number
    },quantity:{
        type:Number,
    },seller:{
        type:String
    },
    img: {
        data: Buffer,
        contentType: String,
    }
    
    
})
module.exports = mongoose.model('Product', selledItems);