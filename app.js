const fs = require('fs');
const express=require("express");
const app=express();


const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");

const flash=require("connect-flash")


const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


const multer  = require('multer');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy=require('passport-local');
const User=require("./models/user.js")



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

//sessions
const sessionOptions={
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*1000*60*60*24,
        httpOnly:true
    }
}
app.use(session(sessionOptions));
app.use(flash())


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})




app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter)


//throwing new express error
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

//error handling middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    console.log(err)
    res.status(statusCode).render("./listings/error.ejs",{err});
});


app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
});