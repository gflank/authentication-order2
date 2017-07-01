const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const OrderSchema = new Schema({
  userId: {
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
  amount: {
    type: Number
  },
  status: {
    type: String,
    enum: ['unpaid', 'paid', 'shipped', 'delivered', 'cancelled'],
    required: true
  }
},
  {
    timestamps: true
  });

module.exports = mongoose.model('Order', OrderSchema);
