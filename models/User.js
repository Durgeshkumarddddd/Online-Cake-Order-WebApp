const mongoose = require('mongoose');
const passportlocalMongoose = require('passport-local-mongoose')
const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true,},
    email: { type: String, required: true, unique: true },
    number : { type: Number, required: true },
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