const ROLE_MEMBER = require('./constants').ROLE_MEMBER;
const ROLE_BUYER = require('./constants').ROLE_BUYER;
const ROLE_SELLER = require('./constants').ROLE_SELLER;
const ROLE_ADMIN = require('./constants').ROLE_ADMIN;

exports.getUserInfo = function getUserInfo(request) {
  const userInfo = {
    _id: request._id,
    email: request.email,
    active: request.active,
    role: request.role,
    cart: request.cart
  };

  return userInfo;
};

exports.getUserProfile = function getUserProfile(request) {
  const userProfile = {
    _id: request._id,
    profile: request.profile,
  };

  return userProfile;
};

exports.getUserPromotions = function getUserPromotions(request) {
  const userPromotions = {
    _id: request._id,
    promotions: request.promotions,
  };

  return userPromotions;
};

exports.getRole = function getRole(checkRole) {
  let role;

  switch (checkRole) {
    case ROLE_ADMIN: role = 4; break;
    case ROLE_SELLER: role = 3; break;
    case ROLE_BUYER: role = 2; break;
    case ROLE_MEMBER: role = 1; break;
    default: role = 1;
  }

  return role;
};

exports.generateQuery = function generateQuery(query, request) {
  for (var q in request.query) {
    if (request.query[q]) {
      query.where(q).equals(request.query[q]);
    } else {
      query.where(q).exists(false);
    }
  }
};
