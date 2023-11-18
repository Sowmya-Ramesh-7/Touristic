const Listing=require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");


module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}

module.exports.renderCreateForm=(req,res)=>{
    res.render("./listings/new.ejs");
}

module.exports.createListings=async (req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;

    let listing=req.body.listing;
    listing['image']={url,filename};
    const newLisitng= new Listing({...listing,owner:req.user._id});
    await newLisitng.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}

module.exports.showListings=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate(
        {path:"reviews",
        populate:{path:"author"}
    }).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exists ");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
}

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}

module.exports.updateListings=async (req,res)=>{
    let {id}=req.params;
    if(!listing){
        req.flash("error","Listing does not exists ");
        res.redirect("/listings");
    }
    if(!req.body.listing){
        throw new ExpressError(400,"Send Valid Data to create a new Listing");
    }
    
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Your Listing updated");
    res.redirect("/listings");
}

module.exports.destroyListings=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}