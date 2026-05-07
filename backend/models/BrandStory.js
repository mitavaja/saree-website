// models/BrandStory.js

import mongoose from "mongoose";

const brandStorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc1: { type: String },
    desc2: { type: String },
    desc3: { type: String },
    video: { type: String }, // video file path or URL
    buttonText: { type: String, default: "Know More" },
  },
  { timestamps: true }
);

const BrandStory = mongoose.models.BrandStory || mongoose.model("BrandStory", brandStorySchema);
export default BrandStory;