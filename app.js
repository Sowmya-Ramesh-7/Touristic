const fs = require('fs');
const express=require("express");
const app=express();
const Listing=require("./models/listing.js");
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/tmp/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 100); //so tht filename is unique
      return cb(null, file.fieldname + '-' + uniqueSuffix+path.extname(file.originalname))
    }
  })
  
  const upload = multer({ storage: storage })

app.engine("ejs",ejsMate);
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));


main()
    .then(()=>{
        console.log("Connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/touristic");
}


//index route
app.get("/listings",async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
});

//new & create route
app.get("/listings/new", (req,res)=>{
    res.render("./listings/new.ejs");
})


app.post("/listings",upload.single('image'),async (req,res)=>{
    console.log(req.body);
    console.log(req.file);
    let listing=req.body.listing;
    listing['image']={
        'data':fs.readFileSync(path.join(__dirname + '/public/tmp/uploads/' + req.file.filename)),
        'contentType':req.file.mimetype
    }
    const newLisitng= new Listing({...listing});
    await newLisitng.save();
    //delete the tempory file
    fs.unlink(req.file.path,(err) => {
        if (err) throw err;
        console.log(`Deleted file ${req.file.path}`);
      });
    res.redirect("/listings");
})

//show route
app.get("/listings/:id", async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    listing['imageUrl']="data:image/"+listing.image.contentType+";base64,"+listing.image.data.toString('base64');
    res.render("./listings/show.ejs",{listing});
});


//edit and update route
app.get("/listings/:id/edit", async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
});
app.put("/listings/:id", async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings")
});

//delete
app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
})


app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
});