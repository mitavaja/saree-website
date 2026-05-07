import Wishlist from "../models/Wishlist.js";

export const addToWishlist = async(req,res)=>{

  try{

    const {userId,productId} = req.body

    let wishlist = await Wishlist.findOne({userId})

    if(!wishlist){

      wishlist = new Wishlist({
        userId,
        products:[{productId}]
      })

    }else{

      const exist = wishlist.products.find(
        p => p.productId.toString() === productId
      )

      if(!exist){
        wishlist.products.push({productId})
      }

    }

    await wishlist.save()

    res.json({success:true,wishlist})

  }catch(err){
    res.json({success:false})
  }

}



export const getWishlist = async(req,res)=>{

  try{

    const {userId} = req.params

    const wishlist = await Wishlist
      .findOne({userId})
      .populate("products.productId")

    res.json({
      success:true,
      wishlist
    })

  }catch(err){
    res.json({success:false})
  }

}