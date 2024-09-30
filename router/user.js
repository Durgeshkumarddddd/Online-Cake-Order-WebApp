const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const Admin = require('../models/admin')
const Order = require('../models/Order');
const cartModel = require('../models/Cart');
const { userInfo } = require('os');
const Cart = require('../models/Cart');
const passport = require('passport')
const ExpressError = require('../ErrorHandler/ExpressError');
const {isUserAuthenticated } = require('../middleware')
const wrapAsync = require('../ErrorHandler/wrapAsync')
const User = require('../models/User')
const {UserSchema} = require('../schema');


const validateUser = (req, res, next)=>{
  let {error} = UserSchema.validate(req.body)
    if(error){
      let ErrMsg = error.details.map(e=> e.message).join(",")
      throw new ExpressError(400 , ErrMsg)
    }
   else {
    next(); 
   }
}


// update shipping address
router.get('/Address/update',isUserAuthenticated, async (req, res) => {
    
    let [userId] = req.flash('userId')
    req.flash('userId', userId)
    let user = await User.findById(userId);
    res.render('user/updateAddress', {user})
  })


// Update Shipping address submit
router.post('/shippingAddress/update',isUserAuthenticated,  async(req, res)=>{
    
    let Id = req.user._id
    await User.findByIdAndUpdate(Id, req.body.router)
    req.flash('success',"Successfully updated")
    res.redirect('/user/profile')
}) 

  
// Register
router.get('/register', (req, res) => {
    res.render('user/register');
  })
  router.post('/register', async (req, res, next) => {
  
    let newUser = new User(req.body.register)
    const password = req.body.register.password;
    const registerUser = await User.register(newUser, password)
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Registration Successfull Welcome!");
      res.redirect('/user')
  
    })
  })
  
  // login page
  router.get('/login', (req, res) => {
    res.render('user/logIn')
  })
  
  router.post('/login', passport.authenticate("user-local", {
    failureRedirect: '/user/login',
    failureFlash: true,
  }),
    async(req, res) => {
      req.flash("success", "Welcome back to Online cake order login user");
      let { email } = req.body;
      // console.log(email);
      let logUser = await User.findOne({ email: email })
      req.flash('userId', logUser._id)
      res.redirect('/user')
    })
  
  // logout route
  router.get('/logout', async (req, res, next) => {
    req.logout((err) => {
      if (err) {
        next(err)
      }
      req.flash('success', "Logout success")
      res.redirect('/user/login')
    })
  })
  
  // filter by price route
  router.get('/filter/range', async (req, res) => {
    let data = req.query;
    let message = req.flash('userId')
    let [userId] = message
    req.flash('userId', userId)
    let all_products = await Product.find({ price: { $gte: Number(data.min), $lte: Number(data.max) } })
    res.render('user/user', { all_products, userId })
  })
  
  // filter by categories route
  router.get('/filter/categories', async (req, res) => {
    let data = req.query;
    let message = req.flash('userId')
    let [userId] = message
    req.flash('userId', userId)
    // console.log(data);
    let all_products = await Product.find({ category: data.category })
    // res.send(all_products)
    res.render('user/user', { all_products, userId})
  })
  
  // user profile route
  router.get('/profile',isUserAuthenticated, async (req, res) => {
    try{
      let message = req.flash('userId')
      let [userId] = message;
      if (userId) {
        let user = await User.findOne({ _id: userId })
        req.flash('userId', userId)
        res.render('user/userProfile', { user })
      }
      else{
        res.render('user/logIn')
      }
    }
    catch(err){
      res.render('user/logIn')
    }
  })
  
  // user route
  router.get('/', async (req, res) => {
    let [userId] = req.flash('userId')
    if (userId) {
      req.flash('userId', userId)
      let all_products = await Product.find()
      res.render('user/user', { all_products, userId })
    }
    else{
      res.render('user/logIn')
    }
  })
  
  // user-show route
  router.get('/:user_id/:productId',isUserAuthenticated, async (req, res) => {
    try{
      let id = req.params.productId;
      let userId = req.params.user_id;
      let product = await Product.findById(id).populate('owner')
      req.flash('userId', userId)
      res.render('user/userShow', { product, userId })
    }
    catch(err){
      res.render('<h>500: Internal Server Error</h>');
    }
  })


  // cart data route
  router.get('/addToCart/:productId/:userId',isUserAuthenticated, async (req, res) => {
    let { productId, userId } = req.params;
    let cartProduct = await Product.findById(productId)
    let curUser = await User.findById(userId);
    let createdCart = await cartModel.create({
      product_id: productId,
      user: userId,
      name: cartProduct.name,
      image: cartProduct.image,
      price: cartProduct.price,
      category: cartProduct.category
    })
    curUser.Cart.push(createdCart._id);
    await curUser.save();
    res.redirect(`/user/${userId}/${productId}`)
    // window.history.back();
    // res.end()
  
  })
  
  // add to cart route 
  router.get('/AddToCart',isUserAuthenticated, async (req, res) => {
    let message = req.flash('userId')
    let [userId] = message
    req.flash('userId', userId)
    let allCarts = await cartModel.find({ user: userId })
    if (allCarts.length != 0) {
      // console.log(allCarts);
      res.render('user/AddToCart.ejs', { allCarts })
  
    }else{
      res.render('user/errorPages/cartError.ejs')
    }
  
  })
  
  router.get('/delete/cart/:cartId',isUserAuthenticated, async (req, res) => {
    let { cartId } = req.params;
    await cartModel.deleteOne({ _id: cartId })
    res.redirect('/user/AddToCart')
  })
  
  // single order route
  router.post('/:userId/product/:productId/admin/:adminId/order',isUserAuthenticated, async (req, res) => {
    const { productId, userId,adminId } = req.params;
    let curUser = await User.findById(userId);
    let curProduct = await Product.findById(productId);
    let newAdmin = await Admin.findById(adminId)
    let order = await Order.create({
      userId: userId,
      productId: productId,
      fullname : curUser.fullname ,
      shippingAddress: {
        number: curUser.number,
        city: curUser.city,
        state: curUser.state,
        country: curUser.country,
        famous_location: curUser.famous_location,
        pincode: curUser.pincode,
      },
      name: curProduct.name,
      image: curProduct.image,
      price: curProduct.price
    })
    newAdmin.orders.push(order)
    await newAdmin.save()
    req.flash('success', "You have successfull by this product")
    res.redirect(`/user/${userId}/${productId}`)
  })
  
  // show orders route
  router.get('/orders', async (req, res) => {
    let message = req.flash('userId')
    let [userId] = message
    req.flash('userId', userId)
    const orders = await Order.find()
    if (orders.length != 0) {
      res.render('user/userOrder', { orders })
    }
    else {
      res.render('user/errorPages/orderError')
    }
  })
  
  // order delete route
  router.get('/deleteOne/order/:orderId', async (req, res) => {
    let { orderId } = req.params;
    console.log(orderId);
    await Order.findOneAndDelete({ _id: orderId })
    let message = req.flash('userId')
    let [userId] = message
    req.flash('userId', userId)
    res.redirect('/user/orders')
  })
  
  //multiple order at a time - route
  router.get('/allOrders',isUserAuthenticated, async (req, res) => {
    let message = req.flash('userId')
    let [userId] = message
    req.flash('userId', userId)
    let curUser = await User.findById(userId);
    let curCart = await cartModel.find({ user: userId })
    console.log(curCart);
  
    curCart.forEach(async cart => {
      await Order.create({
        userId: userId,
        productId: cart.product_id,
        shippingAddress: {
          number: curUser.number,
          city: curUser.city,
          state: curUser.state,
          country: curUser.country,
          famous_location: curUser.famous_location,
          pincode: curUser.pincode,
        },
        name: cart.name,
        image: cart.image,
        price: cart.price
      })
  
    })
  
    await cartModel.deleteMany({ user: userId })
    res.redirect('/user/AddToCart')
  })


  module.exports = router
  