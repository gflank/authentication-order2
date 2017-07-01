// Importing Node packages required for schema
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const ROLE_MEMBER = require('../constants').ROLE_MEMBER;
const ROLE_BUYER = require('../constants').ROLE_BUYER;
const ROLE_SELLER = require('../constants').ROLE_SELLER;
const ROLE_ADMIN = require('../constants').ROLE_ADMIN;

const Schema = mongoose.Schema;

//= ===============================
// User Schema
//= ===============================
const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true,
    default: false
  },
  profile: {
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    organization: { type: Schema.Types.ObjectId, ref: 'Organization' }
  },
  role: {
    type: String,
    enum: [ROLE_MEMBER, ROLE_SELLER, ROLE_BUYER, ROLE_ADMIN],
    required: true,
    default: ROLE_MEMBER
  },
  promotions: [{
    seller: { type: Schema.Types.ObjectId, ref: 'Promotion' },
    level: { type: Number }
  }],
  cart: {
    type: Schema.Types.ObjectId,
    ref: 'Cart'
  },
  stripe: {
    customerId: { type: String },
    subscriptionId: { type: String },
    lastFour: { type: String },
    plan: { type: String },
    activeUntil: { type: Date }
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
},
  {
    timestamps: true
  });

//= ===============================
// User ORM Methods
//= ===============================

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function (next) {
  const user = this,
    SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Method to compare password for login
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return cb(err); }

    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
