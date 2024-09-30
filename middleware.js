const Admin = require('./models/admin')
const User = require('./models/User') 
// Middleware to Check Admin Authentication
module.exports.isAdminAuthenticated = (req, res, next)=> {
    if (req.isAuthenticated() && req.user instanceof Admin) {
      return next();
    }
    req.flash('error', 'Please log in as Admin to access this page.');
    res.redirect('/admin/login');
  }
  
  // Middleware to Check User Authentication
 module.exports.isUserAuthenticated = (req, res, next)=>{
    if (req.isAuthenticated() && req.user instanceof User) {
      return next();
    }
    req.flash('error', 'Please log in to access this page.');
    res.redirect('/user/login');
  }
  


module.exports.isOwner = async(req, res, next)=>{
    let {id} = req.params 
    try{
        let admin =await Admin.findById(id)
        if ( !admin.admin.equals( res.locals.currUser._id )){
           req.flash("error", "You have not permission to edit only owner can edit")
           return res.redirect(`/AllProducts`)
        }
        next();
    
}catch (error) {
    console.error(error);
    req.flash("error", "Product not found");
    return res.redirect(`/admin/login`); // Stop execution on error
}
} 
