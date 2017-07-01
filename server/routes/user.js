const AuthenticationController = require('../controllers/authentication');
const UserController = require('../controllers/user');
const express = require('express');
const passport = require('passport');
const ROLE_ADMIN = require('../constants').ROLE_ADMIN;

const passportService = require('../config/passport');
const requireAuth = passport.authenticate('jwt', { session: false });

userRoutes = express.Router(),

// View user profile route
userRoutes.get('/:userId', requireAuth, UserController.viewProfile);

// Update user profile route
userRoutes.post('/:userId', requireAuth, UserController.updateProfile);

// Activate account route
userRoutes.post('/activate/:userId', requireAuth, AuthenticationController.roleAuthorization(ROLE_ADMIN), UserController.activate);

// Deactivate account route
userRoutes.post('/deactivate/:userId', requireAuth, AuthenticationController.roleAuthorization(ROLE_ADMIN), UserController.deactivate);

userRoutes.get('/promote/:userId', requireAuth, UserController.viewPromotions);

userRoutes.post('/promote', requireAuth, UserController.grantPromotion);

// Query accounts route
userRoutes.get('/', requireAuth, AuthenticationController.roleAuthorization(ROLE_ADMIN), UserController.queryUsers);

module.exports = userRoutes;
