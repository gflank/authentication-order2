const Cart = require('../models/cart');
const Product = require('../models/product');

//= =======================================
// Cart Routes
//= =======================================
exports.updateCart = function (req, res, next) {
  const cartId = req.user.cart;
  const productId = req.body.productId;
  const old_qty = req.body.old_qty;
  const new_qty = req.body.new_qty;
  const price = req.body.price;
  const delta = new_qty - old_qty;

  var now = Date.now();

  var query = {
    '_id': cartId,
    'items.item': productId,
    'items.qty': old_qty,
    'status': 'active'
  };
  var update = {
    $set: {
      'last_modified': now,
      'items.$.qty': new_qty,
      'items.$.price': price
    }
  };

  Cart.findOneAndUpdate(query, update, { upsert: true, new: true }, (err, updatedCart) => {
    if (err) {
      res.status(500).json({ error: 'Failed to update the cart.' });
      return next(err);
    }

    var query = {
      '_id': productId,
      'carted.cart': cartId,
      'in_stock': { '$gte': delta }
    };
    var update = {
      $inc: { 'in_stock': -delta },
      $set: {
        'carted.$.qty': new_qty,
        'carted.$.timestamp': now
      }
    };
    
    Product.findOneAndUpdate(query, update, { passRawResult: true }, (err, product, result) => {
      if (!result.lastErrorObject['updatedExisting']) {
        Cart.findOneAndUpdate({ '_id': cartId, 'items.item': productId },
          { '$set': { 'items.$.qty': old_qty } }).exec();

        res.status(500).json({ error: 'The product is not enough in stock.' });
        return next(err);
      }

      return res.status(200).json({ cart: updatedCart._id });
    });
  });
};

exports.addToCart = function (req, res, next) {
  const cartId = req.user.cart;
  const productId = req.body.productId;
  const qty = req.body.qty;
  const price = req.body.price;

  var now = Date.now();

  var query = {
    '_id': cartId,
    'status': 'active'
  };
  var update = {
    $set: { 'last_modified': now },
    $push: {
      'items': {
        'item': productId,
        'qty': qty,
        'price': price
      }
    }
  };

  Cart.findOneAndUpdate(query, update, { upsert: true, new: true }, (err, updatedCart) => {
    if (err) {
      res.status(500).json({ error: 'Failed to update the cart.' });
      return next(err);
    }

    var query = {
      '_id': productId,
      'in_stock': { $gte: qty }
    };
    var update = {
      $inc: { 'in_stock': -qty },
      $push: {
        'carted': {
          'cart': cartId,
          'qty': qty,
          'timestamp': now
        }
      }
    };
    
    Product.findOneAndUpdate(query, update, { passRawResult: true }, (err, product, result) => {
      if (!result.lastErrorObject['updatedExisting']) {
        Cart.findByIdAndUpdate(cartId, { $pull: { 'items': { 'item': productId } } }).exec();

        res.status(500).json({ error: 'The product is not enough in stock.' });
        return next(err);
      }

      return res.status(200).json({ cart: updatedCart._id });
    });
  });
};

exports.removeFromCart = function (req, res, next) {
  const cartId = req.user.cart;
  const productId = req.body.productId;
  const qty = req.body.qty;

   var query = {
    '_id': cartId,
    'items.item': productId,
    'items.qty': qty,
    'status': 'active'
  };

  var now = Date.now();

  var remove = {
    $set: { 'last_modified': now },
    $pull: { 'items': { 'item': productId } }
  };

  Cart.findOneAndUpdate(query, remove, (err, cart) => {
    if (err) {
      res.status(500).json({ error: 'Cannot remove the item from the cart.' });
      return next(err);
    }

    Product.findOneAndUpdate({ '_id': productId, 'carted.cart': cartId },
      { $inc: { 'in_stock': qty }, $pull: { 'carted': { 'cart': cartId } } },
      (err, product) => {
        if (err) {
          Cart.findByIdAndUpdate(cartId, { $push: { 'items': { 'item': productId, 'qty': qty } } });

          res.status(500).json({ error: 'Failed to put the item back.' });
          return next(err);
        }

        return res.status(200).json({ cart: cart._id });
    });
  });
};

exports.getItems = function (req, res, next) {
  const cartId = req.user.cart;

  Cart.findById(cartId)
  .populate('items.item')
  .exec((err, cart) => {
    if (err) {
      res.status(500).json({ error: 'Failed to find a cart for the user ' + req.user.email + '.' });
      return next(err);
    }

    return res.status(200).json({ items: cart.items });
  });
};
