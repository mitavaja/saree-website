import mongoose from "mongoose";

const policySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["privacy", "terms", "return", "shipping"],
    required: true,
    unique: true
  },
  content: {
    type: String, // ✅ HTML content
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Policy", policySchema);