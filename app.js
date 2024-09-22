const express = require('express')
const app = express()
const mongoose = require('mongoose');
const PORT = 8080
const path = require('path')
const ejsMate = require('ejs-mate')
const Admin = require('./models/admin')
const Product = require('./models/product')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const flash = require('connect-flash');
const {isOwner, isLoggedIn} = require('./middleware')
const wrapAsync = require('./ErrorHandler/wrapAsync')
const ExpressError = require('./ErrorHandler/ExpressError');

main().then(console.log("Connection with db successfull"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/OnlineCakeOrder');
}
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set("views",path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));

app.use(session({
  secret: 'secretKeyword',
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires : Date.now() + 7 * 24 * 60 * 60 * 100,
    maxAge :  7 * 24 * 60 * 60 * 100,
    httpOnly: true    
  }
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser()); 

app.use((req, res, next)=>{
  res.locals.success = req.flash("success")  
  res.locals.error = req.flash("error")  
  res.locals.CurrUser = req.user;
  next();
})
// index page
app.get('/', (req, res)=>{
  res.send('Successfull created app')

})
// Home page 
app.get('/home',isLoggedIn, (req, res)=>{
   let registerAdmin = req.user;
    res.render('admin/home.ejs',{registerAdmin})
})   
// create new Product
app.get('/admin/products/new',isLoggedIn, (req,res)=>{
  res.render('admin/new')    
})
  
// Save the new Product  
app.post('/admin/:id/products/new', wrapAsync(async (req, res)=>{
  let  newProduct = await new Product(req.body.product)
  newProduct.owner = req.user._id ;
  let newAdmin = await Admin.findById(req.user._id)
  newAdmin.products.push(newProduct._id)
  await newProduct.save();
  await newAdmin.save();
  console.log(newAdmin);
  req.flash('success','new product added')
  res.redirect('/admin/Products');    

}))

// Show All Product
app.get('/admin/Products',isLoggedIn, wrapAsync(async(req,res)=>{
  let {id} = req.params
  const AllProducts = await Product.find({owner : id});
  res.render('admin/allProducts',{AllProducts});
}))

// Delete product 
app.get('/admin/:id/products/:productId/delete',isLoggedIn, wrapAsync(async(req,res)=>{
  let {id, productId} = req.params ;
  await Product.findByIdAndDelete(productId);
  let newAdmin = await Admin.findByIdAndUpdate(id, {$pull : {products : productId}})
  console.log(newAdmin);
  req.flash('success', ' product deleted ');
  res.redirect('/AllProducts')
}))

// Edit Product 
app.get('/admin/:id/products/:productId/edit',isLoggedIn, wrapAsync( async(req,res)=>{
  const product = await Product.findById(req.params.productId);
  res.render('admin/edit',{product})
}))

// Update Product 
app.post('/admin/:id/products/:productId/edit', wrapAsync( async (req,res)=>{
  let {productId} = req.params;
  await Product.findByIdAndUpdate(productId, req.body.product);
  req.flash('success', 'Edited Success')
  res.redirect('/AllProducts');
}))

// show product 
app.get('/admin/:id/products/:productId/show', wrapAsync(async(req, res)=>{
  let {productId} = req.params ;
  let product = await Product.findById(productId).populate('owner')
  // console.log(product)
  res.render('admin/show', {product})
}))
// manage orders
app.get('/admin/order', (req, res)=>{  
  res.render('admin/manageOrder');
})
// information
app.get('/admin/info', (req, res)=>{
  res.render('admin/info');
})
// Register
app.get('/register', (req, res)=>{ 
  res.render('admin/register');   
})

app.post('/register', wrapAsync(async(req, res)=>{
  let newAdmin = new Admin(req.body.register)
  const password = req.body.register.password ;
  const registerAdmin = await Admin.register(newAdmin , password)
  console.log(registerAdmin)
  req.login(registerAdmin, (err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","Registration Successfull Welcome!")
    res.render('admin/home.ejs',{registerAdmin})
  })
 
}))

// login page
app.get('/login', (req, res)=>{
  res.render('admin/login')
})
app.post('/login', passport.authenticate("local",{
   failureRedirect: '/login',
    failureFlash : true,}),
 wrapAsync(async(req, res)=>{  
  req.flash("success", "Welcome back to Online cake order login user");
  let registerAdmin = req.user    
  res.render('admin/home',{registerAdmin}) 
  }))
  // Admin details 
  app.get('/admin/:id/details', isLoggedIn, (req, res) => {
    // res.status(200).json(req.user);  // req.user contains the logged-in admin details
    res.render()
  });
  
  // logout function
  app.get('/logout', wrapAsync(async (req, res, next)=>{
    req.logout((err)=>{
      if(err){
        next(err)
      }
      req.flash('success', "Logout success")
       res.redirect('/login')
    })
  }))

// Error handler middleware
app.all('*',(req,res,next)=>{
  next( new ExpressError(404, "Page Not Found"))
})

app.use((err,req,res,next)=>{
  let {statusCode = 500, message = "some thing went wrong"} = err ;
  res.render('includes/Error.ejs',{err});
  //.send(message)
});

app.listen(PORT , ()=>{       
    console.log(`Server started on port no: ${PORT}`)  
})     