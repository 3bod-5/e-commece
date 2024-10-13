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
    const all = await collection.find({})
    res.render('all-users',{users:all})
})

app.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await collection.findByIdAndDelete(id);
        if (user) {
            res.status(200).send(`User with ID ${id} deleted successfully.`);
        } else {
            res.status(404).send('User not found.');
        }
    } catch (error) {
        res.status(500).send('An error occurred while deleting the user.');
    }
});


module.exports = app