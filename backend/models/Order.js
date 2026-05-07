import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },

  // ✅ UPDATED STRUCTURE
  items: [
    {
      productId: String,
      name: String,
      image: String,
      price: Number,
      quantity: Number
    }
  ],

  amount: {
    type: Number,
    required: true
  },

  address: {
    type: Object,
    required: true
  },

  paymentMethod: {
    type: String,
    required: true
  },

  payment: {
    type: Boolean,
    default: false
  },

  // Razorpay related fields
  razorpayOrderId: {
    type: String,
  },

  paymentDetails: {
    type: Object,
  },

  status: {
    type: String,
    default: "Pending"
  },

  date: {
    type: Number,
    required: true
  }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;