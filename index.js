// server.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const Product = require('./models/product');
const User = require('./models/User');
const Order = require('./models/Order');
const mongooseConnection = require('./config/mongoose')
const path = require('path')
const session = require('express-session');
const flash = require('connect-flash');
const cartModel = require('./models/Cart');
const { userInfo } = require('os');
const Cart = require('./models/Cart');
// const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')

app.use(session({
  secret: 'secretKeyword',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 100,
    maxAge: 7 * 24 * 60 * 60 * 100,
    httpOnly: true
  }
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set up flash middleware
app.use(flash());

app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, 'views'))
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")))
// app.use(express.static(path.join(__dirname, "public")))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// home page 
app.get('/', (req, res) => {
  res.render('index')
})


// Register
app.get('/register', (req, res) => {
  res.render('user/register');
})
app.post('/register', async (req, res, next) => {

  let newUser = new User(req.body.register)
  const password = req.body.register.password;
  const registedUser = await User.register(newUser, password)
  // console.log(registedUser)
  req.login(registedUser, (err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Registration Successfull Welcome!")
    res.redirect('/login')

  })
})

// login page
app.get('/login', (req, res) => {
  res.render('user/logIn')
})

app.post('/login', passport.authenticate("local", {
  failureRedirect: '/login',
  failureFlash: true,
}),
  async (req, res) => {
    req.flash("success", "Welcome back to Online cake order login user");
    let { email } = req.body;
    // console.log(email);

    let logUser = await User.findOne({ email: email })
    req.flash('userId', logUser._id)
    res.redirect('/user')
  })

// logout route
app.get('/logout', async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err)
    }
    req.flash('success', "Logout success")
    res.redirect('/login')
  })
})


// filter by price route
app.get('/filter/range', async (req, res) => {
  let data = req.query;
  let message = req.flash('userId')
  let [userId] = message
  req.flash('userId', userId)
  let all_products = await Product.find({ price: { $gte: Number(data.min), $lte: Number(data.max) } })
  res.render('user', { all_products, userId })
})

// filter by categories route
app.get('/filter/categories', async (req, res) => {
  let data = req.query;
  let message = req.flash('userId')
  let [userId] = message
  req.flash('userId', userId)
  // console.log(data);
  let all_products = await Product.find({ category: data.category })
  // res.send(all_products)
  // res.render('user', { all_products, userId})
})


// user profile route
app.get('/user/profile', async (req, res) => {
  try{
    let message = req.flash('userId')
    let [userId] = message;
    if (userId) {
      let user = await User.findOne({ _id: userId })
      req.flash('userId', userId)
      res.render('userProfile', { user })
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
app.get('/user', async (req, res) => {
  let [userId] = req.flash('userId')
  if (userId) {
    req.flash('userId', userId)
    let all_products = await Product.find()
    res.render('user', { all_products, userId })
  }
  else{
    res.render('user/logIn')
  }
})

// user-show route
app.get('/user/:user_id/:productId', async (req, res) => {
  try{
    let id = req.params.productId;
    let userId = req.params.user_id;
    let product = await Product.findById(id)
    req.flash('userId', userId)
    res.render('userShow', { product, userId })
  }
  catch(err){
    res.render('<h>500: Internal Server Error</h>');
  }
})

// cart data route
app.get('/user/addToCart/:productId/:userId', async (req, res) => {
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
app.get('/user/AddToCart', async (req, res) => {
  let message = req.flash('userId')
  let [userId] = message
  req.flash('userId', userId)
  let allCarts = await cartModel.find({ user: userId })
  if (allCarts.length != 0) {
    // console.log(allCarts);
    res.render('AddToCart.ejs', { allCarts })

  }else{
    res.render('errorPages/cartError.ejs')
  }

})

app.get('/user/delete/cart/:cartId', async (req, res) => {
  let { cartId } = req.params;
  await cartModel.deleteOne({ _id: cartId })
  res.redirect('/user/AddToCart')
})

// single order route
app.get('/user/order/:productId/:userId', async (req, res) => {
  const { productId, userId } = req.params;
  let curUser = await User.findById(userId);
  let curProduct = await Product.findById(productId);

  await Order.create({
    userId: userId,
    productId: productId,
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
  res.redirect(`/user/${userId}/${productId}`)
})

// show orders route
app.get('/user/orders', async (req, res) => {
  let message = req.flash('userId')
  let [userId] = message
  req.flash('userId', userId)
  const orders = await Order.find()
  if (orders) {
    res.render('userOrder', { orders })
  }
  else {
    res.send('Not found')
  }
})

// order delete route
app.get('/user/deleteOne/order/:orderId', async (req, res) => {
  let { orderId } = req.params;
  console.log(orderId);
  await Order.findOneAndDelete({ _id: orderId })
  let message = req.flash('userId')
  let [userId] = message
  req.flash('userId', userId)
  res.redirect('/user/orders')
})

//multiple order at a time - route
app.get('/user/allOrders', async (req, res) => {
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



// Product Routes
// app.post('/admin/products', async (req, res) => {
//   try {
//     const product = new Product(req.body);
//     await product.save();
//     res.status(201).send(product);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// app.get('/products', async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.status(200).send(products);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // User Routes
// app.post('/users/register', async (req, res) => {
//   try {
//     const user = new User(req.body);
//     await user.save();
//     res.status(201).send(user);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// app.post('/users/login', async (req, res) => {
//   // Authentication logic here
// });

// // Order Routes
// app.post('/orders', async (req, res) => {
//   try {
//     const order = new Order(req.body);
//     await order.save();
//     res.status(201).send(order);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// app.get('/orders/:userId', async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.params.userId });
//     res.status(200).send(orders);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
