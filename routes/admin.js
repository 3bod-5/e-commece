const express = require('express');
const app = express.Router();
const collection = require('../database/collection')
const products = require('../database/product')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser');
const session = require('express-session');
app.use(session({secret: "Your secret key" , saveUninitialized:false , resave:false}));
app.use(express.static("layouts"))
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',async(req,res)=>{
    const name = req.session.user.name
    const user = await collection.findOne({name:name});
    res.render('admin',{user:user})
})


module.exports = app