const AuthenticationController = require('../controllers/authentication');
const ProductController = require('../controllers/product');
const express = require('express');
const passport = require('passport');
const ROLE_SELLER = require('../constants').ROLE_SELLER;

const passportService = require('../config/passport');
const requireAuth = passport.authenticate('jwt', { session: false });

const productRoutes = express.Router();

productRoutes.get('/', requireAuth, ProductController.queryProducts);

productRoutes.get('/:productId', requireAuth, ProductController.getProduct);

productRoutes.get('/seller/:sellerId', requireAuth, AuthenticationController.roleAuthorization(ROLE_SELLER), ProductController.getProductsForSeller);

productRoutes.post('/create', requireAuth, AuthenticationController.roleAuthorization(ROLE_SELLER), ProductController.createProduct);

productRoutes.post('/:productId', requireAuth, ProductController.updateProduct);

module.exports = productRoutes; 
