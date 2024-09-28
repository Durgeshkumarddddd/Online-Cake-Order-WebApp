const express = require('express')
const router = express.Router();
const Admin = require('../models/admin')
const Product = require('../models/product')
const {isOwner, isLoggedIn} = require('../middleware')
const wrapAsync = require('../ErrorHandler/wrapAsync')
const passport = require('passport')
const {AdminSchema} = require('../schema')
const User = require('../models/User')
const Order = require('../models/Order')

const validateAdmin = (req, res, next)=>{
  let {error} =  AdminSchema.validate(req.body)
    if(error){
      let ErrMsg = error.details.map(e=> e.message).join(",")
      throw new ExpressError(400 , ErrMsg)
    }
   else {
    next(); 
   }
}

// Register
router.get('/register', (req, res)=>{ 
  res.render('admin/register');   
})

router.post('/register', wrapAsync(async(req, res)=>{
  let {name, username,email,contactno,shopname,shopImage,state,city,pincode,address, password } = req.body
  let newAdmin = new Admin({name, username,email,contactno,shopname,shopImage,state,city,pincode,address})
  // const password = req.body.register.password ;
  const registerAdmin = await Admin.register(newAdmin , password)

  req.login(registerAdmin, (err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","Registration Successfull Welcome!")
    res.render('admin/home.ejs',{registerAdmin})
  })
}))

// login page
router.get('/login', (req, res)=>{
  res.render('admin/login.ejs')
})
router.post('/login', passport.authenticate("local",{
   failureRedirect: '/admin/login',
    failureFlash : true,
  }),
 wrapAsync(async(req, res)=>{  
  let registerAdmin = req.user 
  req.flash("success", "Welcome back to Online cake order login user");
    res.render('admin/home',{registerAdmin}) 
  }))

  // logout function
  router.get('/logout',isLoggedIn, wrapAsync(async (req, res, next)=>{
    req.logout((err)=>{
      if(err){
        next(err)
      }
      req.flash('success', "Logout success")
       res.redirect('/admin/login')
    })
  }))

// Home page 
router.get('/home',isLoggedIn, (req, res)=>{
   let registerAdmin = req.user;
    res.render('admin/home.ejs',{registerAdmin})
})   

// create new Product
router.get('/products/new',isLoggedIn, (req,res)=>{
  res.render('admin/new')    
})
  
// Save the new Product  
router.post('/:id/products/new',isLoggedIn, wrapAsync(async (req, res)=>{
  let  newProduct = await new Product(req.body.product)
  newProduct.owner = req.user._id ;
  let newAdmin = await Admin.findById(req.user._id)
  newAdmin.products.push(newProduct._id)
  await newProduct.save();
  await newAdmin.save();
  req.flash('success','new product added')
  res.redirect('/admin/Products');    

}))

// Show All Product
router.get('/Products',isLoggedIn, wrapAsync(async(req,res)=>{
  let id = req.user._id 
  const AllProducts = await Product.find({owner : id});
  res.render('admin/allProducts',{AllProducts});
}))

// Delete product 
router.get('/:id/products/:productId/delete',isLoggedIn, wrapAsync(async(req,res)=>{
  let {id, productId} = req.params ;
  await Product.findByIdAndDelete(productId);
  let newAdmin = await Admin.findByIdAndUpdate(id, {$pull : {products : productId}})

  req.flash('success', ' product deleted ')
  res.redirect('/admin/products')
}))

// Edit Product 
router.get('/:id/products/:productId/edit',isLoggedIn, wrapAsync( async(req,res)=>{
  const product = await Product.findById(req.params.productId);
  res.render('admin/edit',{product})
}))

// Update Product 
router.post('/:id/products/:productId/edit',isLoggedIn, wrapAsync( async (req,res)=>{
  let {productId} = req.params;
  await Product.findByIdAndUpdate(productId, req.body.product);
  req.flash('success', 'Edited Success')
  res.redirect('/admin/products');
}))

// Show product 
router.get('/:id/products/:productId/show',isLoggedIn, wrapAsync(async(req, res)=>{
  let {productId} = req.params ;
  let product = await Product.findById(productId).populate('owner')
  // console.log(product)
  res.render('admin/show', {product})
}))

// manage orders
router.get('/order',isLoggedIn, async(req, res)=>{  
    let id = req.user._id
    let newAdmin = await Admin.findById(id).populate('orders')
    let Allorders = newAdmin.orders;
    // newOrders.forEach( async (order) => {
    //   let newUserId = await User.findById(order.userId)
    //   console.log(newUserId)
    if(Allorders && Allorders.length==0){
      req.flash('error', " You have not not any Order ")
      res.send('<h1>You have not any Order placed </h1>');
    }
      res.render('admin/manageOrder', { Allorders } )  
    
      
})  
// manage Status  
 router.get('/:id/orderStatus', isLoggedIn, async(req, res) =>{
  let {id} = req.params
  let { status} = req.query 
   await Order.findOneAndUpdate({status : status})
  res.redirect('/admin/order')
 })

 // Delete Order after delivered
 router.get('/:id/deleteOrder', isLoggedIn, async(req, res)=>{
  let {id} = req.params
  let curAdminId = req.user._id
  let newOrder = await Order.findByIdAndDelete(id)
  let newAdmin=await Admin.findByIdAndUpdate(curAdminId, {$pull : {orders : id}})
   res.redirect('/admin/order')  
 })

// information
router.get('/info', (req, res)=>{      
  res.render('admin/info');
})

  module.exports = router