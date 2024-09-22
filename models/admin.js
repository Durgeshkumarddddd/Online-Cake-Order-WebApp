const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const product = require('./product')
const passportLocalMongoose = require('passport-local-mongoose');
// Define the Admin Schema
const AdminSchema = new Schema({
  name : {
    type: String,
    required: true,
  },
  shopname : {
    type : String, 
    required : true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true
  },
  products : [{
    type : Schema.Types.ObjectId,
    ref : 'product'
  }],
  contactNo : {
    type : Number ,
    require:true ,
    minlength : 10 ,
  },
  pincode : {
    type : Number,
  },
  city : {
    type : String,
  },
  state : {
    type : String ,
  },
  address : {
    type : String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
AdminSchema.plugin(passportLocalMongoose);

// Create the Admin model

const admin = mongoose.model('admin', AdminSchema);
module.exports = admin ;

