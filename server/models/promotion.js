const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const PromotionSchema = new Schema({
  product: {
    type: Schema.Type.ObjectId,
    ref: 'Product'
  },
  name: {
    type: String
  }
  qty: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Promotion', PromotionSchema);
