var Joi = require('joi');

exports.auth = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{4,30}/).required()
  }
};
