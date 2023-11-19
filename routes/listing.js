if(process.env.NODE_ENV!="production"){
  require("dotenv").config();
}


const express=require("express");
const router=express.Router({mergeParams:true});

const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")


const path=require("path");
const wrapAsync=require("../utils/wrapAsync.js");

const listingController=require("../controllers/listing.js")



const multer  = require('multer');
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage })

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListings));

//new 
router.get("/new", isLoggedIn, listingController.renderCreateForm)

router
  .route("/:id")
  .get( wrapAsync(listingController.showListings))
  .put(isLoggedIn, isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListings))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListings));


//edit and update route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports=router;