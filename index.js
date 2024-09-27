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


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
