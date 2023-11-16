const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs");
});

router.post("/signup",wrapAsync(async (req,res)=>{
    try{
        let {fullname,username,email,password}=req.body;
        const newUser=new User({fullname,email,username});
        const registeredUser=await User.register(newUser,password);
        req.flash("success",`Welcome to Touristic, ${fullname}`);
        res.redirect("/listings");
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

module.exports=router