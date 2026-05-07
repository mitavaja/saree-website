import mongoose from "mongoose";

const footerSchema = new mongoose.Schema(
  {
    logo: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },

    categories: [{ type: String }],

    footerLinks: [
      {
        name: String,
        url: String,
      },
    ],

    newsletterText: { type: String, default: "" },

    bottomText: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Footer", footerSchema);