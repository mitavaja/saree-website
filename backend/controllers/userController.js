import userModel from "../models/User.js";
import Order from "../models/Order.js";

// PROFILE
export const getUserProfile = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.userId)
      .select("-password");

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// UPDATE
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const user = await userModel.findByIdAndUpdate(
      req.userId,
      { name, email, phone, address },
      { new: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ORDERS
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .sort({ date: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};