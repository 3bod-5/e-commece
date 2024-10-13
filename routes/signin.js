const express = require('express');
const app = express.Router();
const collection = require('../database/collection')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser');
const session = require('express-session');
app.use(session({secret: "Your secret key" , saveUninitialized:false , resave:false}));
app.use(express.static("views"))
app.use(express.static("views/customer"))


// Middleware to serve static files
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    res.render('signin')
})

app.post("/",async(req,res)=>{
    const name = req.body.name
    const password = req.body.password
    const type = req.body.type
    const exist = await collection.findOne({name:name})
    if(exist){
        res.send("Choose onther name please")  
    }else{
        const encryptionPass = await bcrypt.hash(password,10)
        session.user = {name:name}
        await collection.insertMany({name:name,password:encryptionPass,type:type})
        res.redirect('/')
    }
})
module.exports = app