const express=require("express");
const router=express.Router({mergeParams:true});
const favoriteController=require("../controllers/favorite.js");
const {saveRedirectUrl}=require("../middleware.js");

const {isLoggedIn}=require("../middleware.js");
const wrapAsync=require("../utils/wrapAsync.js");

router.get("/",isLoggedIn, wrapAsync(favoriteController.showMyFavorites));

router.route("/:id")
    .post(isLoggedIn, wrapAsync(favoriteController.addToFavorite))
    .delete(isLoggedIn,saveRedirectUrl,wrapAsync(favoriteController.destroyFavorite));

module.exports=router;