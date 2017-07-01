const StripeController = require('../controllers/stripe');
const express = require('express');
const passport = require('passport');

const passportService = require('../config/passport');
const requireAuth = passport.authenticate('jwt', { session: false });

const payRoutes = express.Router();

// Webhook endpoint for Stripe
payRoutes.post('/webhook-notify', StripeController.webhook);

// Charge
payRoutes.post('/charge', StripeController.charge);

// Create customer and subscription
payRoutes.post('/customer', requireAuth, StripeController.createCustomer);

// Update customer object and billing information
payRoutes.put('/customer', requireAuth, StripeController.updateCustomer);

// Delete subscription from customer
//payRoutes.delete('/subscription', requireAuth, StripeController.deleteSubscription);

// Upgrade or downgrade subscription
//payRoutes.put('/subscription', requireAuth, StripeController.changeSubscription);

// Fetch customer information
payRoutes.get('/customer', requireAuth, StripeController.getCustomer);

module.exports = payRoutes; 
