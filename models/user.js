const mongoose=require("mongoose");
const Schema=mongoose.Schema
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    favorites:{
        type:Schema.Types.ObjectId,
        ref:"Favorite"
    },

});

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);



