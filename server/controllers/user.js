const User = require('../models/user');
const Cart = require('../models/cart');
const ROLE_ADMIN = require('../constants').ROLE_ADMIN;
const getUserProfile = require('../helpers').getUserProfile;
const getUserPromotions = require('../helpers').getUserPromotions;
const generateQuery = require('../helpers').generateQuery;

//= =======================================
// User Routes
//= =======================================
exports.viewProfile = function (req, res, next) {
  const userId = req.params.userId;

  if (req.user.role != ROLE_ADMIN && req.user._id.toString() !== userId) {
    return res.status(401).json({ error: 'You are not authorized to view this user profile.' });
  }

  User.findById(userId, (err, user) => {
    if (err) {
      res.status(400).json({ error: 'No user could be found for this ID.' });
      return next(err);
    }

    const userToReturn = getUserProfile(user);

    return res.status(200).json({ user: userToReturn });
  });
};

exports.updateProfile = function (req, res, next) {
  const userId = req.params.userId;

  if (req.user._id.toString() !== userId) {
    return res.status(401).json({ error: 'You are not authorized to update this user profile.' });
  }

  var p = {};
  for (var field in req.body) {
    p['profile.'+field] = req.body[field];
  }
  var update = {
    $set: p
  }

  User.findByIdAndUpdate(userId, update, { new: true }, (err, updatedUser) => {
    if (err) {
      res.status(400).json({ error: 'No user could be found for this ID.' });
      return next(err);
    }

    const userToReturn = getUserProfile(updatedUser);
    return res.status(200).json({ user: userToReturn });
  });
};

exports.viewPromotions = function (req, res, next) {
  const userId = req.params.userId;

  if (req.user.role != ROLE_ADMIN && req.user._id.toString() !== userId) {
    return res.status(401).json({ error: 'You are not authorized to view this user profile.' });
  }

  User.findById(userId, (err, user) => {
    if (err) {
      res.status(400).json({ error: 'No user could be found for this ID.' });
      return next(err);
    }

    const userToReturn = getUserPromotions(user);

    return res.status(200).json({ user: userToReturn });
  });
};

exports.grantPromotion = function (req, res, next) {
  const buyerId = req.body.buyerId;
  const sellerId = req.body.sellerId;
  const level = req.body.level;

  if (req.user.role != ROLE_ADMIN && req.user._id.toString() != sellerId.toString()) {
    return res.status(401).json({ error: 'You are not authorized to grant promotion.' });
  }

  var query = {
    '_id': buyerId,
    'promotions.seller': sellerId
  }
  var update = {
    $set: {
      'promotions.$.level': level
    }
  }

  User.findOneAndUpdate(query, update, { new: true }, (err, updatedUser) => {
    if (err) {
      res.status(400).json({ error: 'No user could be found for this ID.' });
      return next(err);
    }

    const userToReturn = getUserPromotions(updatedUser);
    return res.status(200).json({ user: userToReturn });
  });
};

exports.activate = function (req, res, next) {
  const userId = req.params.userId;

  Cart.findOneAndUpdate({ owner: userId }, { $set: { status: 'active' } }, { upsert: true, new: true }, (err, newCart) => {
    if (err) {
      res.status(500).json({ error: 'Cannot find a cart for the user ' + userId +'.' });
      return next(err);
    }

    User.findByIdAndUpdate(userId, { $set: { active: true, cart: newCart._id } },  (err, activeUser) => {
      if (err) {
        newCart.status = 'inactive';
        newCart.save().exec();

        res.status(500).json({ error: 'Failed to activate the user ' + userId + '.' });
        return next(err);
      }

      return res.status(200).json({ content: 'The user ' + activeUser.email + ' has been activated.' });
    });
  });
};

exports.deactivate = function (req, res, next) {
  const userId = req.params.userId;

  Cart.findOneAndUpdate({ owner: userId }, { $set: { status: 'inactive' } }, (err, cart) => {
    if (err) {
      res.status(500).json({ error: 'Cannot deactivate the user ' + userId + ' due to cart deactivation failure.'});
      return next(err);
    }

    User.findByIdAndUpdate(userId, { $set: { active: false } }, (err, inactiveUser) => {
      if (err) {
        cart.status = 'active';
        cart.save().exec();
 
        res.status(500).json({ error: 'Failed to deactivate the user ' + userId + '.' });
        return next(err);
      }

      return res.status(200).json({ content: 'The user ' + inactiveUser.email + ' has been deactivated.' });
    });
  });
};

exports.queryUsers = function (req, res, next) {
  var query = User.find();
  generateQuery(query, req);
  query.select('_id');

  query.exec((err, userIds) => {
    if (err) {
      res.status(500).json({ error: 'Failed to query the users.' });
      return next(err);
    }

    return res.status(200).json({ users: userIds });
  });
};
