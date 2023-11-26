const favorite = require("../models/favorite.js");
const Listing=require("../models/listing.js");
const User=require("../models/user.js");
const ExpressError=require("../utils/ExpressError.js");
const cloudinary = require('cloudinary').v2;




module.exports.index=async (req,res)=>{
    const allListings=await Listing.find(req.query).sort({avgRating:-1}).populate("owner");
    return res.render("./listings/index.ejs",{allListings});
}

module.exports.allListings=async (req,res)=>{
        const allListings=await Listing.find(req.query).populate("owner");
        return res.render("./listings/showAll.ejs",{allListings});
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
    listing['favorite']=false;
    if("user" in req){
       let user= await User.findById(req.user._id).populate(
        {path:"favorites",
        populate:{path:"listings"}
        });
        console.log(user.favorites.listings);
        let fav =user.favorites.listings
        let favIds=[]
        for(let i in fav){
            favIds[i]=fav[i]._id;
        }
        favIds=favIds.map(objectId => objectId.toString());
        console.log(id.toString().includes(favIds))
        console.log(favIds)
        if(favIds.includes(id.toString())){
            listing['favorite']=true;
        }else{
            listing['favorite']=false;
        }  
    }
    res.render("./listings/show.ejs",{listing});
}

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exists ");
        res.redirect("/listings");
    }
    let url=listing.image.url;
    let editedUrl=url.replace("/upload","/upload/w_250")
    res.render("./listings/edit.ejs",{listing,editedUrl});
}

module.exports.updateListings=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing['image']={url,filename};
        await listing.save();
    }

    req.flash("success","Your Listing updated");
    res.redirect("/listings");
}

module.exports.destroyListings=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}