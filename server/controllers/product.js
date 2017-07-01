var _ = require('underscore');
var odoo = require('odoo-xmlrpc');
const Product = require('../models/product'),
  User = require('../models/user');
const generateQuery = require('../helpers').generateQuery;

exports.queryProducts = function (req, res, next) {
  const userId = req.user._id;

  var query = Product.find();
  generateQuery(query, req);
  query.select('_id name description features price image in_stock seller');

  User.findById(userId, (err, user) => {
    var promo = user.promotions;
    query.exec((err, products) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }

      var filteredProducts = [];
      for (var k = 0; k < products.length; k++) {
        var filteredProduct = {};
        filteredProduct._id = products[k]._id;
        filteredProduct.name = products[k].name;
        filteredProduct.description = products[k].description;
        filteredProduct.fetures = products[k].features;
        filteredProduct.image = products[k].image;
        filteredProduct.in_stock = products[k].in_stock;
        filteredProduct.seller = products[k].seller;

        var level = 0;
        for (var i = 0; i < promo.length; i++) {
          if (promo[i].seller.toString() == filteredProduct.seller.toString()) level = promo[i].level;
        }
        var p;
        for (var i = 0; i < products[k].price.length; i++) {
          if (products[k].price[i].level == level) p = products[k].price[i].value;
        }
        filteredProduct.price = p;
        filteredProducts.push(filteredProduct);
      }

      return res.status(200).json({ products: _.groupBy(filteredProducts, function(p) { return p.name; }) });
    });
  });
};

exports.getProduct = function (req, res, next) {
  const userId = req.user._id;
  const productId = req.params.productId;

  User.findById(userId, (err, user) => {
    var promo = user.promotions;

    Product.findById(productId, (err, product) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }

      var filteredProduct = {};
      filteredProduct._id = product._id;
      filteredProduct.name = product.name;
      filteredProduct.description = product.description;
      filteredProduct.fetures = product.features;
      filteredProduct.image = product.image;
      filteredProduct.in_stock = product.in_stock;
      filteredProduct.seller = product.seller;

      var level = 0;
      for (var i = 0; i < promo.length; i++) {
        if (promo[i].seller.toString() == filteredProduct.seller.toString()) level = promo[i].level;
      }
      var p;
      for (var i = 0; i < product.price.length; i++) {
        if (product.price[i].level == level) p = product.price[i].value;
      }
      filteredProduct.price = p;

      return res.status(200).json({ product: filteredProduct });
    });
  });
};

exports.getProductsForSeller = function (req, res, next) {
  const sellerId = req.params.sellerId;

  if (req.user._id.toString() !== sellerId) {
    return res.status(401).json({ error: 'You are not authorized to view this content.' });
  }

  Product.find({ seller: req.params.sellerId })
    .select('_id')
    .exec((err, productIds) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }

      return res.status(200).json({ products: productIds });
    });
};

exports.createProduct = function (req, res, next) {
  if (req.user._id.toString() !== req.body.seller) {
    return res.status(401).json({ error: 'You are not authorized to add this product.' });
  }

  const product = new Product(req.body);

  product.save((err, newProduct) => {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    return res.status(200).json({ product: newProduct._id });
  });
};

exports.updateProduct = function (req, res, next) {
  const productId = req.params.productId;

  Product.findById(productId, (err, product) => {
    if (err) {
      res.status(400).json({ error: 'No product could be found for this ID.' });
      return next(err);
    }
    if (req.user._id.toString() !== product.seller.toString()) {
      return res.status(401).json({ error: 'You are not authorized to update this product.' });
    }

    for (var field in product) {
      if (req.body[field] != undefined) {
        product[field] = req.body[field];
      }
    }

    product.save((err, updatedProduct) => {
      if (err) {
        return next(err);
      }

      return res.status(200).json({ product: updatedProduct._id });
    });
  });
};
