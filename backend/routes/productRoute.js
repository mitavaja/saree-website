import express from "express";
import upload from "../middleware/multer.js";

import {
  addProduct,
  productList,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

// ✅ ADD PRODUCT
router.post(
  "/add",
  upload.fields([
    { name: "image", maxCount: 1 },   // main image
    { name: "images", maxCount: 3 },  // thumbnails
    { name: "video", maxCount: 1 }    // video
  ]),
  addProduct
);

// ✅ GET ALL PRODUCTS
router.get("/list", productList);

// ✅ GET SINGLE PRODUCT (🔥 IMPORTANT for product page)
router.get("/:id", async (req, res) => {
  try {
    const product = await (await import("../models/Product.js")).default.findById(req.params.id);

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
});

// ✅ UPDATE PRODUCT
router.put(
  "/update/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 3 },
    { name: "video", maxCount: 1 }
  ]),
  updateProduct
);

// ✅ DELETE PRODUCT
router.delete("/delete/:id", deleteProduct);

export default router;