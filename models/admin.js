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
  shopImage : {
    type : String,
    default :"https://plus.unsplash.com/premium_photo-1721858125140-57077cfc8b1a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" ,
    
    set: (v)=>v ===""? "https://plus.unsplash.com/premium_photo-1721858125140-57077cfc8b1a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v ,              

  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address']
  },
  contactno : {
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
  },
  products : [{
    type : Schema.Types.ObjectId,
    ref : 'product'
  }],
  orders : [{
    type : Schema.Types.ObjectId,
    ref : 'Order'
  }]

});
AdminSchema.plugin(passportLocalMongoose);

// Create the Admin model

const admin = mongoose.model('admin', AdminSchema);
module.exports = admin ;

