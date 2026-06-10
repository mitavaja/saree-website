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

  // ✅ REDEFINING SAREE FASHION (DYNAMIC)
  redefineSubtitle: String,
  redefineTitle: String,
  redefineDesc: String,
  stat1Val: String,
  stat1Text: String,
  stat2Val: String,
  stat2Text: String,
  redefineImage: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("About", aboutSchema);