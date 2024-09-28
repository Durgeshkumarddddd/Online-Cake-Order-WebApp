const express = require('express')
const app = express()
const mongoose = require('mongoose');
const PORT = 3000
const path = require('path')
const ejsMate = require('ejs-mate')
const Admin = require('./models/admin')
const Product = require('./models/product')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const flash = require('connect-flash');
const User = require('./models/User');
const adminRoute = require('./router/admin')
const userRoute = require('./router/user')
const bodyParser = require('body-parser');

app.use(bodyParser.json());

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

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
  res.locals.success = req.flash("success")  
  res.locals.error = req.flash("error")  
  res.locals.CurrUser = req.user;
  next();
})

app.use("/admin" , adminRoute);   
app.use("/user" , userRoute);

// index page
app.get('/', (req, res)=>{
  res.render('admin/index')  

})
/

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