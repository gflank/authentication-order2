const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  upc: {
    type: String,
    required: true
  },
  mpn: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  features:[{
    feature: {
      type: String
    },
    value: {
      type: String
    }
  }],
  price: [{
    level: {
      type: Number
    },
    value: {
      type: Number
    }
  }],
  image: {
    data: {
      type: Buffer
    },
    contentType: {
      type: String
    }
  },
  in_stock: {
    type: Number,
    require: true
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  carted: [{
    cart: {
      type: Schema.Types.ObjectId,
      ref: 'Cart'
    },
    number: {
      type: Number,
    },
    timestamp: {
      type: Date,
    }
  }]},
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  });

module.exports = mongoose.model('Product', ProductSchema);
