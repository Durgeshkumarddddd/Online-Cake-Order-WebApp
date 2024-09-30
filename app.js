const express = require('express')
const app = express()
const mongoose = require('mongoose');
const PORT = 3000
const path = require('path')
const ejsMate = require('ejs-mate')
const Admin = require('./models/admin')
const Product = require('./models/product')
const User = require('./models/User')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const flash = require('connect-flash');
const adminRoute = require('./router/admin')
const userRoute = require('./router/user')

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

// Admin Strategy
passport.use('admin-local', new LocalStrategy(Admin.authenticate()));

// User Strategy
passport.use('user-local', new LocalStrategy(User.authenticate()));

// Serialize User
passport.serializeUser((user, done) => {
  const userType = user instanceof Admin ? 'Admin' : 'User';
  done(null, { id: user.id, type: userType });
});

// Deserialize User
passport.deserializeUser(async (obj, done) => {
  try {
    let user;
    if (obj.type === 'Admin') {
      user = await Admin.findById(obj.id);
    } else if (obj.type === 'User') {
      user = await User.findById(obj.id);
    } else {
      throw new Error('No user type specified');
    }

    if (!user) {
      throw new Error('User not found');
    }

    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

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