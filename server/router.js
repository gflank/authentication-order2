const authRoutes = require('./routes/authentication');
const userRoutes = require('./routes/user');
const organizationRoutes = require('./routes/organization');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const payRoutes = require('./routes/payment');
const communicationRoutes = require('./routes/communication');
const express = require('express');

module.exports = function (app) {
  // Initializing route groups
  const apiRoutes = express.Router();

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);

  apiRoutes.use('/user', userRoutes);

  apiRoutes.use('/org', organizationRoutes);

  apiRoutes.use('/product', productRoutes);

  apiRoutes.use('/cart', cartRoutes);

  apiRoutes.use('/order', orderRoutes);

  apiRoutes.use('/pay', payRoutes);

  apiRoutes.use('/comm', communicationRoutes);

  // Set url for API group routes
  app.use('/api', apiRoutes);
};
