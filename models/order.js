const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  status: { type: String, default: 'Pending' },
  shippingAddress: {
    number: { type: Number, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    famous_location: { type: String, required: true },
    pincode: { type: Number, required: true },
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model('Order', orderSchema);