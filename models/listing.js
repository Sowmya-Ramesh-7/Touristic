const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js")

const listingSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image: { 
        url:String ,
        filename: String 
    },
    category:{
        type:String,
        enum:['Places to Visit','Place to Stay','Things To Do','Restuarants']
    },
    destType:{
        type:String,
        enum: ['Adventure', 'Beaches', 'Nature', 'Culture and Heritage', 'Recreational', 'Wellness', 'Others']
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
                {
                type:Schema.Types.ObjectId,
                ref:"Review"
            }
        ],
    avgRating:{
        type:Number,
        default:0
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports =Listing;