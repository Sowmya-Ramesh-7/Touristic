const express=require("express");
const router=express.Router({mergeParams:true});

const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")


const path=require("path");
const wrapAsync=require("../utils/wrapAsync.js");

const listingController=require("../controllers/listing.js")



const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './routes/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 100); //so tht filename is unique
      return cb(null, file.fieldname + '-' + uniqueSuffix+path.extname(file.originalname))
    }
  })
  
  const upload = multer({ storage: storage })

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(upload.single('image'),validateListing,wrapAsync(listingController.createListings));


//new 
router.get("/new", isLoggedIn, listingController.renderCreateForm)



//show route
router.get("/:id", wrapAsync(listingController.showListings));


//edit and update route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
router.put("/:id",isLoggedIn, isOwner,validateListing, wrapAsync(listingController.updateListings));

//delete
router.delete("/:id",isLoggedIn, isOwner, wrapAsync(listingController.destroyListings));

module.exports=router;