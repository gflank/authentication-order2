const Promotion = require('../models/promotion'),
  Product = require('../models/product');
const generateQuery = require('../helpers').generateQuery;

exports.createPromotion = function (req, res, next) {
  const productId = req.body.productId;

  Product.findById(productId, (err, product) => {
    if (req.user._id.toString() !== product.seller) {
      return res.status(401).json({ error: 'You are not authorized to add this promotion.' });
    }

    const promotion = new Promotion({
      product: productId,
      name: req.body.name,
      qty: req.body.qty,
      discount: req.body.discount
    });

    promotion.save((err, newPromotion) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }

      return res.status(200).json({ promotion: newPromotion._id });
    });
  });
};

exports.updatePromotion = function (req, res, next) {
  const promotionId = req.params.promotionId;

  Promotion.findById(promotionId, (err, promotion) => {
    if (err) {
      res.status(400).json({ error: 'No promotion could be found for this ID.' });
      return next(err);
    }
    Product.findById(promotion.product, (err, product) => {
      if (req.user._id !== product.seller) {
        return res.status(401).json({ error: 'You are not authorized to update this promotion.' });
      }

      for (var field in promotion) {
        if (req.body[field] != undefined) {
          promotion[field] = req.body[field];
        }
      }

      promotion.save((err, updatedPromotion) => {
        if (err) {
          return next(err);
        }

        return res.status(200).json({ message: 'Promotion successfully updated!' });
      });
    });
  });
};

exports.getPromotion = function (req, res, next) {
  const promotionId = req.params.promotionId;

  Promotion.findById(promotionId, (err, promotion) => {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    return res.status(200).json({ promotion: promotion });
  });
};

exports.queryPromotions = function (req, res, next) {
  var query = Promotion.find();
  generateQuery(query, req);
  query.select('_id discount');

  query.exec((err, promotionIds) => {
    if (err) {
      return next(err);
    }

    return res.status(200).json({ promotions: promotionIds});
  });
};
