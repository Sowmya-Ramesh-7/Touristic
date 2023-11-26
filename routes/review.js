const express=require("express");
const router=express.Router({mergeParams:true});
const reviewController=require("../controllers/review.js");

const {isLoggedIn,validateReview,isReviewAuthor}=require("../middleware.js");
const wrapAsync=require("../utils/wrapAsync.js");


//create new review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReviews));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReviews));

module.exports=router;