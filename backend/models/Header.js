import mongoose from "mongoose";

const headerSchema = new mongoose.Schema({
  logo: { type: String, default: "" },
  navLinks: [
    {
      name: { type: String, required: true },
      link: { type: String, required: true }
    }
  ]
}, { timestamps: true });

const headerModel = mongoose.models.header || mongoose.model("header", headerSchema);
export default headerModel;
