const mongoose = require('mongoose');
const mongooseConnect = require('../config/mongoose');
const cakeData = require('./cakeData');
const cakeModel = require('../models/product');

// mongoose.connect('mongodb://127.0.0.1:27017/WanderLust')

const init = async () => {
await cakeModel.insertMany(cakeData)
    
}


init();