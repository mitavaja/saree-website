import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  // ✅ NEW → SHORT DESCRIPTION
  description: {
    type: String,
    required: true
  },

  // ✅ NEW → FEATURES LIST
  features: {
    type: [String],
    required: true,
    validate: {
      validator: function (val) {
        return val.length > 0;
      },
      message: "At least 1 feature required"
    }
  },

  price: {
    type: Number,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  color: {
    type: String,
    trim: true
  },

  stock: {
    type: Number,
    default: 0
  },

  status: {
    type: Boolean,
    default: true
  },

  bestsellerCount: {
    type: Number,
    default: 0
  },

  // MAIN IMAGE
  image: {
    type: String,
    required: true
  },

  // MAX 3 THUMBNAILS
  images: {
    type: [String],
    validate: {
      validator: function (val) {
        return val.length <= 3;
      },
      message: "Maximum 3 thumbnails allowed"
    },
    default: []
  },

  // VIDEO
  video: {
    type: String,
    required: true
  }

}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;