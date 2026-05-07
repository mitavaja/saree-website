import Product from "../models/Product.js";

// ADD PRODUCT
export const addProduct = async (req, res) => {
  try {

    const {
      name,
      description,   // ✅ NEW
      features,      // ✅ NEW (string or array)
      price,
      category,
      color,
      stock,
      status
    } = req.body;

    // ✅ MAIN IMAGE
    const image = req.files?.image
      ? `/uploads/${req.files.image[0].filename}`
      : "";

    // ✅ THUMBNAILS
    const images = req.files?.images
      ? req.files.images.map(file => `/uploads/${file.filename}`)
      : [];

    // ✅ VIDEO
    const video = req.files?.video
      ? `/uploads/${req.files.video[0].filename}`
      : "";

    // 🔥 VALIDATION
    if (!image) {
      return res.json({ success: false, message: "Main image required" });
    }

    if (images.length !== 3) {
      return res.json({ success: false, message: "Exactly 3 thumbnails required" });
    }

    if (!video) {
      return res.json({ success: false, message: "Video required" });
    }

    if (!description) {
      return res.json({ success: false, message: "Description required" });
    }

    // ✅ FEATURES HANDLE (string → array)
    let featuresArray = [];
    if (features) {
      if (Array.isArray(features)) {
        featuresArray = features;
      } else {
        featuresArray = features.split(",").map(f => f.trim());
      }
    }

    if (featuresArray.length === 0) {
      return res.json({ success: false, message: "At least 1 feature required" });
    }

    const product = new Product({
      name,
      description,     // ✅ SAVE
      features: featuresArray, // ✅ SAVE
      price,
      category,
      color,
      stock,
      status,
      image,
      images,
      video
    });

    await product.save();

    res.json({
      success: true,
      message: "Product Added",
      product
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};


// GET LIST
export const productList = async (req, res) => {
  try {

    const products = await Product.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      products
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};


// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      name,
      description,   // ✅ NEW
      features,      // ✅ NEW
      price,
      category,
      color,
      stock,
      status
    } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    // ✅ FEATURES HANDLE
    let featuresArray = product.features;
    if (features) {
      if (Array.isArray(features)) {
        featuresArray = features;
      } else {
        featuresArray = features.split(",").map(f => f.trim());
      }
    }

    let updateData = {
      name,
      description,          // ✅ UPDATE
      features: featuresArray, // ✅ UPDATE
      price,
      category,
      color,
      stock,
      status
    };

    // IMAGE
    if (req.files?.image) {
      updateData.image = `/uploads/${req.files.image[0].filename}`;
    } else {
      updateData.image = product.image;
    }

    // THUMBNAILS
    if (req.files?.images) {
      if (req.files.images.length !== 3) {
        return res.json({ success: false, message: "Exactly 3 thumbnails required" });
      }
      updateData.images = req.files.images.map(
        file => `/uploads/${file.filename}`
      );
    } else {
      updateData.images = product.images;
    }

    // VIDEO
    if (req.files?.video) {
      updateData.video = `/uploads/${req.files.video[0].filename}`;
    } else {
      updateData.video = product.video;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: "Product Updated",
      product: updatedProduct
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};


// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {

    const { id } = req.params;

    await Product.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Product Deleted"
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};