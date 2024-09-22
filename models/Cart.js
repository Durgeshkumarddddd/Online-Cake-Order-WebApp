const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    product_id: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
     },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: {type: Number, required: true},
    category: {type: String, required: true}
  });
  
module.exports = mongoose.model('Cart', cartSchema);