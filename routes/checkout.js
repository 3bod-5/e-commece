const express = require('express');
const session = require('express-session');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_4eC39HqLyjWDarjtT1zdp7dc'); // Replace with your actual secret key
 // Replace with your secret key

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: 'your-secret-key', // Replace with your session secret
    resave: false,
    saveUninitialized: true,
}));

// Route to render the checkout page
app.get('/', (req, res) => {
    const cart = req.session.cart || [];
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    res.render('checkout', { totalAmount });
});


app.post('/create-checkout-session', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('User not logged in');
    }

    const cart = req.session.cart || [];
    const lineItems = cart.map(item => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: item.name,
            },
            unit_amount: item.price * 100, // Stripe requires amount in cents
        },
        quantity: item.quantity || 1,
    }));

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${req.headers.origin}/success`,
            cancel_url: `${req.headers.origin}/cancel`,
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle successful payment
app.get('/success', (req, res) => {
    res.send('Payment successful! Thank you for your purchase.');
});

// Route to handle canceled payment
app.get('/cancel', (req, res) => {
    res.send('Payment canceled.');
});

module.exports = app;

