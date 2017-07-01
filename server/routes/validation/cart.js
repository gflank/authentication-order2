var Joi = require('joi');

exports.updateCart = {
  body: {
    productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    old_qty: Joi.number().integer().required(),
    new_qty: Joi.number().integer().required()
  }
};

exports.modifyCart = {
  body: {
    productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    qty: Joi.number().integer().required()
  }
};
