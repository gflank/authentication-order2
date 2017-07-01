const CartController = require('../controllers/cart');
const express = require('express');
const passport = require('passport');
const validate = require('express-validation');

const passportService = require('../config/passport');
const validation = require('./validation/cart');
const requireAuth = passport.authenticate('jwt', { session: false });

const cartRoutes = express.Router();

cartRoutes.get('/', requireAuth, CartController.getItems);

cartRoutes.post('/', requireAuth, validate(validation.modifyCart), CartController.addToCart);

cartRoutes.delete('/', requireAuth, validate(validation.modifyCart), CartController.removeFromCart);

cartRoutes.put('/', requireAuth, validate(validation.updateCart), CartController.updateCart);

module.exports = cartRoutes; 
