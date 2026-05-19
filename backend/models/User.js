import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  email: { type: String, required: true },
  password: { type: String },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  otp: { type: String },
  otpExpiry: { type: Date }
});

const userModel = mongoose.model("user", userSchema);

export default userModel;