const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("./users/signup.ejs");
}

module.exports.userSignup=async (req,res)=>{
    try{
        let {fullname,username,email,password}=req.body;
        const newUser=new User({fullname,email,username});
        const registeredUser=await User.register(newUser,password);
        //automatic login after signup
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }
        })
        req.flash("success",`Welcome to Touristic, ${fullname}`);
        return res.redirect("/listings");
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("./users/login.ejs");
}

module.exports.userLogin=async (req,res)=>{
    req.flash("success","You are logged in !!!");
    if(res.locals.redirectUrl){
        redirectUrl=res.locals.redirectUrl
        pos=redirectUrl.search("/reviews/")
        if(pos!==-1){
            redirectUrl=redirectUrl.slice(0, pos+1);
        }
        return res.redirect(redirectUrl); 
    }
    res.redirect("/listings");
    
}

module.exports.userLogout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are logged out !");
        res.redirect("/listings")
    })
}