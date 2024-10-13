const mongoose = require("mongoose")
const connect = mongoose.connect("mongodb://127.0.0.1:27017/e-commerce")
var Schema = mongoose.Schema;
connect.then(() =>{
    console.log("Database connected succefuly")
}).catch(() => {
    console.log("Database cannot connect")
})

const cart = new mongoose.Schema({
    name:{
        type:String
    },
    price:{
        type:Number
    },quantity:{
        type:Number,
    }
    
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
    }
    
    
})
const user = new mongoose.Schema({
    name: { type: String, required: true },
    password:{type:String,required:true},
    type:{type:String,required:true},
    cart:[cart],
    selledItem:[selledItems]
});

const collection = new mongoose.model("e-commerce",user)

module.exports = collection
