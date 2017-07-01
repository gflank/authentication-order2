const CommunicationController = require('../controllers/communication');
const express = require('express');
const passport = require('passport');

const passportService = require('../config/passport');
const requireAuth = passport.authenticate('jwt', { session: false });

const communicationRoutes = express.Router();

// Send email from contact form
communicationRoutes.post('/contact', CommunicationController.sendContactForm);

module.exports = communicationRoutes;
