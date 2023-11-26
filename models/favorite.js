const mongoose=require("mongoose");
const Schema=mongoose.Schema

const favoriteSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    listings:[{
        type:Schema.Types.ObjectId,
        ref:"Listing"
    }]
})

module.exports=mongoose.model("Favorite",favoriteSchema);