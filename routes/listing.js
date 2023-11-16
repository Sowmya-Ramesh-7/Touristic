const express=require("express");
const router=express.Router({mergeParams:true});

const fs = require('fs');
const Listing=require("../models/listing.js");

const path=require("path");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

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

//index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));

//new & create route
router.get("/new", (req,res)=>{
    res.render("./listings/new.ejs");
})


router.post("/",upload.single('image'),validateListing,wrapAsync(async (req,res)=>{
    console.log(req.body);
    console.log(req.file);
    let listing=req.body.listing;
    listing['image']={
        'data':fs.readFileSync(path.join(__dirname+'/uploads/' + req.file.filename)),
        'contentType':req.file.mimetype
    }
    const newLisitng= new Listing({...listing});
    await newLisitng.save();
    //delete the tempory file
    fs.unlink(req.file.path,(err) => {
        if (err) throw err;
        console.log(`Deleted file ${req.file.path}`);
      });
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}));

//show route
router.get("/:id", wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing does not exists ");
        res.redirect("/listings");
    }
    listing['imageUrl']="data:image/"+listing.image.contentType+";base64,"+listing.image.data.toString('base64');
    res.render("./listings/show.ejs",{listing});
}));


//edit and update route
router.get("/:id/edit", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}));
router.put("/:id",validateListing, wrapAsync(async (req,res)=>{
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
}));

//delete
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}));

module.exports=router;