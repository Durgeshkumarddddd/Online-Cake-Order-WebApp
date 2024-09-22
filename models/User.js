const mongoose = require('mongoose');
const passportlocalMongoose = require('passport-local-mongoose')
const userSchema = new mongoose.Schema({
    // name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    number: { type: Number, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    famous_location: { type: String, required: true },
    pincode: { type: Number, required: true },
    Cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart'
        }
    ]
});
userSchema.plugin(passportlocalMongoose);

module.exports = mongoose.model('User', userSchema);