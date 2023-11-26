const User=require("../models/user.js");
const Favorite=require("../models/favorite.js");

module.exports.addToFavorite=async (req,res)=>{
    let {id}=req.params;
    let user=await User.findById(req.user._id);
    if(user['favorites']){
        let fav=await Favorite.findById(user['favorites'])
        if(!fav.get('listings',"")){
            fav['listings']=[id];
        }else if (!fav['listings'].includes(id)) {
            fav['listings'].push(id);
        }
        fav.save();
    }else{
        let newFavorites=new Favorite({"user":req.user,"listings":[id]});
        newFavorites.save()
        user['favorites']=newFavorites._id;
        user.save()
    }
    res.redirect('/listings');
}

module.exports.showMyFavorites=async (req,res)=>{
    let user= await User.findById(req.user._id).populate(
        {path:"favorites",
        populate:{path:"listings"}
        });
    return res.render("./listings/showAll.ejs",{allListings:user.favorites.listings});
}
    

module.exports.destroyFavorite=async (req,res)=>{
    let {id}=req.params;
    console.log("destroyFavorite");
    let user=await User.findById(req.user._id).populate("favorites");
    let fav = await Favorite.findByIdAndUpdate(user['favorites'], { $pull: { listings: id } });
    fav.save();
    if(fav.listings.length===0){
        await Favorite.findByIdAndDelete(fav._id);
        let updatedUser=await User.findByIdAndUpdate(req.user._id,{$unset:{favorites:1}});
        updatedUser.save()
    }
    console.log("favorite removed")
}