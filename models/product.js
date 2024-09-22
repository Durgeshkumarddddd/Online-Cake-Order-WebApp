const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    name : String ,
    description : String ,
    image : String ,
    price : Number ,
    category : String ,
    owner : {
        type: Schema.Types.ObjectId ,
        ref: 'admin'
      },   
    weight : Number ,
    available : Number ,

})
const product = mongoose.model('product', productSchema);
 
module.exports = product       