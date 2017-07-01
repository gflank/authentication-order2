const AuthenticationController = require('../controllers/authentication');
const express = require('express');
const passport = require('passport');
const validate = require('express-validation');

const passportService = require('../config/passport');
const validation = require('./validation/authentication');
const requireLogin = passport.authenticate('local', { session: false });

const authRoutes = express.Router();

// Registration route
authRoutes.post('/register', validate(validation.auth), AuthenticationController.register);

// Login route
authRoutes.post('/login', validate(validation.auth), requireLogin, AuthenticationController.login);

// Password reset request route (generate/send token)
authRoutes.post('/forgot-password', AuthenticationController.forgotPassword);

// Password reset route (change password using token)
authRoutes.post('/reset-password/:token', AuthenticationController.verifyToken);

module.exports = authRoutes;
