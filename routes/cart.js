const express = require('express');
const app = express.Router();
const collection = require('../database/collection')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser');
const session = require('express-session');
app.use(session({secret: "Your secret key" , saveUninitialized:false , resave:false}));
app.use(express.static("layouts"))
app.use(express.static("views/customer"))




app.use(bodyParser.urlencoded({ extended: true }));



app.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('User not logged in');
    }

    try {
        // Retrieve the user's cart from the database
        const user = await collection.findOne({ name: req.session.user.name });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Get the cart from the session or database
        const cart = req.session.cart || user.cart || [];

        res.render('cart', { cart });
    } catch (error) {
        console.error('Error retrieving cart:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.post('/remove', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('User not logged in');
    }

    const { name } = req.body; // Use `name` or `itemId` depending on your implementation

    try {
        // Find the user from the database
        const user = await collection.findOne({ name: req.session.user.name });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Remove item from session cart
        if (req.session.cart) {
            req.session.cart = req.session.cart.filter(item => item.name !== name);
        }

        // Remove item from user's cart in the database
        const updatedCart = (user.cart || []).filter(item => item.name !== name);

        await collection.updateOne(
            { name: req.session.user.name },
            { $set: { cart: updatedCart } }
        );

        res.redirect('/cart');
    } catch (error) {
        console.error('Error removing item:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.post('/update-quantity', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('User not logged in');
    }

    const { name, quantity } = req.body;

    try {
        // Convert quantity to integer and validate
        const newQuantity = parseInt(quantity);
        if (isNaN(newQuantity) || newQuantity <= 0) {
            return res.status(400).send('Invalid quantity');
        }

        // Find the user from the database
        const user = await collection.findOne({ name: req.session.user.name });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update item quantity in session cart
        if (req.session.cart) {
            req.session.cart = req.session.cart.map(item => 
                item.name === name ? { ...item, quantity: newQuantity } : item
            );
        }

        // Update item quantity in user’s cart in the database
        const updatedCart = (user.cart || []).map(item => 
            item.name === name ? { ...item, quantity: newQuantity } : item
        );

        await collection.updateOne(
            { name: req.session.user.name },
            { $set: { cart: updatedCart } }
        );

        res.redirect('/cart');
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).send('Internal Server Error');
    }
});




module.exports = app