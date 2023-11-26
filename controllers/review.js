
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.createReviews=async(req,res)=>{
    let listing=await Listing.findById(req.params.id).populate("reviews");
    console.log(listing)
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing["reviews"].push(newReview);
    console.log(listing["reviews"].length)
    let total=0;
    for(let review of listing["reviews"]){
        console.log(review)
        total+= review.rating
    }
    listing["avgRating"]=total/listing["reviews"].length
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReviews=async(req,res)=>{
    let {id,reviewId}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    let deletedReview=await Review.findByIdAndDelete(reviewId);
    listing["avgRating"]=((listing["avgRating"]*(listing["reviews"].length+1))-deletedReview.rating)/listing["reviews"].length;
    listing.save()
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`)
}