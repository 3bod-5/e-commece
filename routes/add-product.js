const express = require('express');
const router = express.Router();
const collection = require('../database/collection');
const product = require('../database/product');  // Assuming this is your MongoDB collection
const bodyParser = require('body-parser');
const session = require('express-session');

router.use(session({
    secret: "Your secret key",
    saveUninitialized: false,
    resave: false
}));
router.use(express.static("layouts"));
router.use(bodyParser.urlencoded({ extended: true }));

// Route to render the add product page
router.get('/', (req, res) => {
    res.render('add-products');
});

// Route to handle adding a product
router.post('/', async (req, res) => {
    const { name, price, quantity } = req.body;

    if (!req.session.user || req.session.user.type !== 'seller') {
        return res.status(401).send('User not logged in or not authorized');
    }

    try {
        const newProduct = new product({
            name,
            price,
            quantity,
            seller: req.session.user.name  // Associate the product with the seller
        });

        await newProduct.save();  // Save the new product to the database

        res.redirect('/selledproducts');  // Redirect to a route that shows the seller's products
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
