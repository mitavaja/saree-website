import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
  heroTitle: String,
  heroSubtitle: String,

  storyTitle: String,
  storyDesc1: String,
  storyDesc2: String,
  storyImage: String,

  bannerText: String,

  whyTitle: String,
  whyItems: [
    {
      title: String,
      description: String
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("About", aboutSchema);