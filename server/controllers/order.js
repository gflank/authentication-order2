const Order = require('../models/order');

exports.getOrder = function (req, res, next) {
  const orderId = req.params.orderId;

  Order.findById(orderId)
  .populate('items.item')
  .exec((err, order) => {
    if (err) {
      res.status(500).json({ error: 'Failed to find the order ' + orderId + '.' });
    }

    if (order.userId.toString() != req.user._id.toString()) {
      return res.status(401).json({ error: 'You are not authorized to view this order.' });
    }

    res.status(200).json({ "order": order });
  });
};

exports.createOrder = function (req, res, next) {
  if (req.user._id.toString() !== req.body.userId) {
    return res.status(401).json({ error: 'You are not authorized to place this order.' });
  }

  const order = new Order(req.body);

  order.save((err, newOrder) => {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    return res.status(200).json({ order: newOrder._id });
  });
};

exports.updateOrder = function (req, res, next) {
  const orderId = req.params.orderId;

  Order.findById(orderId, (err, order) => {
    if (err) {
      res.status(400).json({ error: 'No order could be found for this ID.' });
      return next(err);
    }
    if (req.user.role != ROLE_ADMIN && req.user._id.toString() !== order.userId.toString()) {
      return res.status(401).json({ error: 'You are not authorized to update this order.' });
    }

    for (var field in order) {
      if (req.body[field] != undefined) {
        order[field] = req.body[field];
      }
    }

    order.save((err, updatedOrder) => {
      if (err) {
        return next(err);
      }

      return res.status(200).json({ order: updatedOrder._id });
    });
  });  
};

exports.queryOrders = function (req, res, next) {
  const userId = req.query.userId;

  if (req.user.role != ROLE_ADMIN && req.user._id.toString() !== userId) {
    return res.status(401).json({ error: 'You are not authorized to view this order.' });
  }

  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);

  var query = Order.find();
  query.where('userId').equals(userId);
  query.where('createdAt').gte(startDate).lt(endDate);
  query.select('_id');
  query.exec((err, orderIds) => {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    return res.status(200).json({ "orders": orderIds });
  });
};
