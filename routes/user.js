const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport")
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/user.js")

router.get("/signup",userController.renderSignupForm);

router.post("/signup",wrapAsync(userController.userSignup));

router.get("/login",userController.renderLoginForm);

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),
    userController.userLogin
    );

router.get("/logout",userController.userLogout);
module.exports=router