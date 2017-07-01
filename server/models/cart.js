const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const CartSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [{
    item: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    qty: {
      type: Number
    },
    price: {
      type: Number
    }
  }],
  last_modified: {
    type: Date
  },
  status: {
    type: String,
    enum: ['inactive', 'active', 'pending'],
    require: true,
    default: 'inactive'
  }
});

module.exports = mongoose.model('Cart', CartSchema);
