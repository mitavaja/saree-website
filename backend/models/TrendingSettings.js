import mongoose from "mongoose";

const trendingSettingsSchema = new mongoose.Schema(
  {
    backgroundColor: {
      type: String,
      default: "#ffffff",
    },
  },
  { timestamps: true }
);

export default mongoose.model("TrendingSettings", trendingSettingsSchema);
