import mongoose from "mongoose";

const trendingSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0, // sorting ke liye
    },
  },
  { timestamps: true }
);

export default mongoose.model("Trending", trendingSchema);