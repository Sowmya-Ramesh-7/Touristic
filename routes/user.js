const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport")
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/user.js")

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.userSignup));

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
    saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),
    userController.userLogin
    );

router.get("/logout",userController.userLogout);
router.get("/privacy",userController.renderPrivacy);
router.get("/terms",userController.renderTerms);

module.exports=router