const Admin = require('./models/admin')
module.exports.isLoggedIn = (req, res, next)=>{
          
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl ;
        req.flash("error", "You must be loggedIn")
     return  res.redirect('/login')
    }
    next()
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
    return res.redirect(`/login`); // Stop execution on error
}
} 
