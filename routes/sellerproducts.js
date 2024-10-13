const express = require('express');
const router = express.Router();
const collection = require('../database/collection');  
const product = require('../database/product');// Assuming this is your MongoDB collection
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');

router.use(session({
    secret: "Your secret key",
    saveUninitialized: false,
    resave: false
}));
router.use(express.static("layouts"));
router.use(bodyParser.urlencoded({ extended: true }));
function ensureSeller(req, res, next) {
    if (req.session.user && req.session.user.type === 'seller') {
        next();
    } else {
        res.status(401).send('Unauthorized: Only sellers can view this page');
    }
}
// Route to get products for the logged-in seller
// Route to get products for the logged-in seller
router.get('/', async (req, res) => {
    if (!req.session.user || req.session.user.type !== 'seller') {
        return res.status(401).send('Unauthorized: Only sellers can view their products');
    }

    const sellerName = req.session.user.name;
    try {
        const products = await product.find({ seller: sellerName });
        res.render('selledProduct', { products: products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;