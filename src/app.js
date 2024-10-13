const express = require('express');
const app = express();
const path = require('path')
const loginRouter = require("../routes/login");
const signinRouter = require("../routes/signin");
const productRouter = require("../routes/product")
const cartRouter = require("../routes/cart")
const checkoutRouter = require("../routes/checkout")
const sellerProductsRouter = require("../routes/sellerproducts")
const addprductRouter = require("../routes/add-product")
const adminRouter = require("../routes/admin")
const AllproductsRouter = require('../routes/all-products')
const AllusersRouter = require("../routes/all-users")
const session = require('express-session');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to `true` if using HTTPS
}));

app.use('/', loginRouter);
app.use('/signin', signinRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter);
app.use('/checkout',checkoutRouter)
app.use('/selledproducts',sellerProductsRouter)
app.use('/add-product',addprductRouter)
app.use('/admin',adminRouter)
app.use('/all-users',AllusersRouter)
app.use('/all-products',AllproductsRouter)



app.listen(3000, () => {
    console.log("welcome to my web page");
});
