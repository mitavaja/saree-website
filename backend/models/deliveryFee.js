import mongoose from "mongoose";

const deliveryFeeSchema = new mongoose.Schema({
  state: { type: String, required: true, unique: true },
  fee: { type: Number, required: true }
}, { timestamps: true });

const deliveryFeeModel = mongoose.model("deliveryFee", deliveryFeeSchema);

export default deliveryFeeModel;