const OrderController = require('../controllers/order');
const express = require('express');
const passport = require('passport');

const passportService = require('../config/passport');
const requireAuth = passport.authenticate('jwt', { session: false });

const orderRoutes = express.Router();

orderRoutes.get('/:orderId', requireAuth, OrderController.getOrder);

orderRoutes.post('/', requireAuth, OrderController.createOrder);

orderRoutes.put('/:orderId', requireAuth, OrderController.updateOrder);

orderRoutes.get('/', requireAuth, OrderController.queryOrders);

module.exports = orderRoutes; 
