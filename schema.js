const Joi = require('joi')
const admin = require('./models/admin')

module.exports.AdminSchema = Joi.object({
    admin : Joi.object({
        name : Joi.string().required(),
        usename : Joi.string().required(),
       email : Joi.string().required(),
        shopname : Joi.string().required(),
        shopimage : Joi.string().required(),
        contactno : Joi.number().required(),
        state  : Joi.string().required(),
        city: Joi.string().required(),
        pincode : Joi.string().required(),

    }).required()
})

module.exports.UserSchema = Joi.object({
        User : Joi.object({
        fullname : Joi.string().required(),
        usename : Joi.string().required(),
       email : Joi.string().required(),
        shopname : Joi.string().required(),
        shopimage : Joi.string().required(),
         number : Joi.number().required(),
         country : Joi.string().required(),
        state  : Joi.string().required(),
        city: Joi.string().required(),
        pincode : Joi.string().required(),
        famous_location:Joi.string().required()
        
    }).required()
})