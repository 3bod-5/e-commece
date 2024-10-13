"use strict";

var express = require('express');

var app = express.Router();

var collection = require('../database/collection');

var bcrypt = require('bcrypt');

var bodyParser = require('body-parser');

var session = require('express-session');

app.use(session({
  secret: "Your secret key",
  saveUninitialized: false,
  resave: false
}));
app.use(express["static"]("layouts"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get('/', function (req, res) {
  res.render('products');
});
app.post('/add-to-cart', function _callee(req, res) {
  var _req$body, name, price, user, quantity, updatedCart;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (req.session.user) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            success: false,
            message: 'User not logged in'
          }));

        case 2:
          _req$body = req.body, name = _req$body.name, price = _req$body.price;
          _context.next = 5;
          return regeneratorRuntime.awrap(collection.findOne({
            name: req.session.user.name
          }));

        case 5:
          user = _context.sent;

          if (user) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            success: false,
            message: 'User not found'
          }));

        case 8:
          // Initialize cart if it doesn't exist
          if (!req.session.cart) {
            req.session.cart = [];
          }

          quantity = 1; // Add product to session cart

          req.session.cart.push({
            name: name,
            price: price,
            quantity: quantity
          }); // Add product to user’s cart in the database

          updatedCart = user.cart || [];
          updatedCart.push({
            name: name,
            price: price
          });
          _context.next = 15;
          return regeneratorRuntime.awrap(collection.updateOne({
            name: req.session.user.name
          }, {
            $set: {
              cart: updatedCart
            }
          }));

        case 15:
          res.json({
            success: true,
            cart: req.session.cart
          });

        case 16:
        case "end":
          return _context.stop();
      }
    }
  });
});
module.exports = app;