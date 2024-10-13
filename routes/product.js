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

app.get('/', async (req, res) => {
    try {
        const allProducts = await products.find({}).lean();
        res.render('products', { products: allProducts });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/add-to-cart', async (req, res) => {
    const { name, price, quantity } = req.body;

    if (!req.session.user) {
        return res.status(401).send('User not logged in');
    }

    if (!req.session.cart) {
        req.session.cart = [];
    }

    // Add item to session cart
    const item = req.session.cart.find(item => item.name === name);
    if (item) {
        item.quantity = (item.quantity || 1) + quantity;
    } else {
        req.session.cart.push({ name, price, quantity });
    }

    // Update user cart in database
    const user = await collection.findOne({ name: req.session.user.name });
    const updatedCart = (user.cart || []).map(item => 
        item.name === name ? { ...item, quantity: (item.quantity || 1) + quantity } : item
    );

    await collection.updateOne(
        { name: req.session.user.name },
        { $set: { cart: updatedCart } }
    );

    res.json({ success: true, cart: req.session.cart });
});


module.exports = app