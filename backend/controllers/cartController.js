import Cart from "../models/Cart.js";

export const addToCart = async(req,res)=>{

  try{

    const {userId,productId} = req.body;

    let cart = await Cart.findOne({userId})

    if(!cart){

      cart = new Cart({
        userId,
        items:[{productId,quantity:1}]
      })

    }else{

      const index = cart.items.findIndex(
        item => item.productId.toString() === productId
      )

      if(index > -1){
        cart.items[index].quantity += 1
      }else{
        cart.items.push({productId,quantity:1})
      }

    }

    await cart.save()

    res.json({
      success:true,
      cart
    })

  }catch(err){
    res.json({success:false,message:err.message})
  }

}



export const getCart = async(req,res)=>{

  try{

    const {userId} = req.params

    const cart = await Cart.findOne({userId}).populate("items.productId")

    res.json({
      success:true,
      cart
    })

  }catch(err){
    res.json({success:false,message:err.message})
  }

}



export const removeCartItem = async(req,res)=>{

  try{

    const {userId,productId} = req.body

    const cart = await Cart.findOne({userId})

    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    )

    await cart.save()

    res.json({success:true})

  }catch(err){
    res.json({success:false})
  }

}