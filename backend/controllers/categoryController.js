import Category from "../models/Category.js";


// ADD CATEGORY
export const addCategory = async(req,res)=>{
  try{

    const category = new Category({
      name:req.body.name
    });

    await category.save();

    res.json({
      success:true,
      message:"Category Added",
      category
    });

  }catch(error){

    res.json({
      success:false,
      message:error.message
    });

  }
};


// GET CATEGORIES
export const getCategories = async(req,res)=>{
  try{

    const categories = await Category.find().sort({createdAt:-1});

    res.json({
      success:true,
      categories
    });

  }catch(error){

    res.json({
      success:false,
      message:error.message
    });

  }
};


// UPDATE CATEGORY
export const updateCategory = async(req,res)=>{
  try{

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {name:req.body.name},
      {new:true}
    );

    res.json({
      success:true,
      category
    });

  }catch(error){

    res.json({
      success:false,
      message:error.message
    });

  }
};


// DELETE CATEGORY
export const deleteCategory = async(req,res)=>{
  try{

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success:true,
      message:"Category Deleted"
    });

  }catch(error){

    res.json({
      success:false,
      message:error.message
    });

  }
};