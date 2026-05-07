import Order from "../models/Order.js";
import Product from "../models/Product.js";
import userModel from "../models/User.js";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const placeOrder = async (req, res) => {
  try {
    const { items, address, paymentMethod } = req.body;
    let userId = null;

    // Check token from headers if user is logged in
    const tokenHeader = req.headers.token;
    if (tokenHeader) {
      try {
        const decoded = jwt.verify(tokenHeader, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (e) {}
    }

    let orderItems = [];
    let totalAmount = 0;

    for (let productId in items) {
      const product = await Product.findById(productId);

      if (!product) continue;

      const quantity = items[productId];

      // ✅ FINAL IMAGE FIX
      const imageUrl = product.image?.startsWith("http")
        ? product.image
        : `http://localhost:5000/uploads/${product.image.split("/").pop()}`;

      orderItems.push({
        productId,
        name: product.name,
        image: imageUrl,
        price: product.price,
        quantity: quantity || 1
      });

      totalAmount += product.price * (quantity || 1);

      // ✅ Update Bestseller Count
      await Product.findByIdAndUpdate(productId, { $inc: { bestsellerCount: quantity || 1 } });
    }

    totalAmount += 50;

    // 1. Find or create user FIRST so we have a valid userId
    let user;
    if (userId) {
      user = await userModel.findById(userId);
    }
    
    const formattedAddress = `${address.address}, ${address.city}, ${address.state} - ${address.pincode}`;

    if (!user) {
      user = await userModel.findOne({ phone: address.phone });
    }

    if (!user) {
      user = new userModel({
        name: address.name,
        email: address.email,
        phone: address.phone,
        address: formattedAddress,
      });
      await user.save();
    } else {
      user.name = address.name;
      user.email = address.email;
      user.address = formattedAddress;
      await user.save();
    }

    userId = user._id;

    // 2. Generate token for auto-login
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // 3. Create the Order with the valid userId
    const order = new Order({
      userId,
      items: orderItems,
      amount: totalAmount,
      address,
      paymentMethod,
      payment: false,
      date: Date.now(),
      status: "Pending"
    });

    await order.save();

    res.json({
      success: true,
      message: "Order placed successfully",
      order,
      token,
      userId: user._id
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};


// Create order in DB and create Razorpay order (for ONLINE payments)
export const createPaymentOrder = async (req, res) => {
  try {
    const { items, address, deliveryFee, paymentMethod } = req.body;
    let userId = null;

    // Check token from headers if user is logged in
    const tokenHeader = req.headers.token;
    if (tokenHeader) {
      try {
        const decoded = jwt.verify(tokenHeader, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (e) {}
    }

    let orderItems = [];
    let totalAmount = 0;

    for (let productId in items) {
      const product = await Product.findById(productId);
      if (!product) continue;
      const quantity = items[productId];

      const imageUrl = product.image?.startsWith("http")
        ? product.image
        : `http://localhost:5000/uploads/${product.image.split("/").pop()}`;

      orderItems.push({
        productId,
        name: product.name,
        image: imageUrl,
        price: product.price,
        quantity: quantity || 1,
      });

      totalAmount += product.price * (quantity || 1);

      await Product.findByIdAndUpdate(productId, { $inc: { bestsellerCount: quantity || 1 } });
    }

    totalAmount += deliveryFee || 50;

    // find or create user
    let user;
    if (userId) {
      user = await userModel.findById(userId);
    }

    const formattedAddress = `${address.address}, ${address.city}, ${address.state} - ${address.pincode}`;

    if (!user) {
      user = await userModel.findOne({ phone: address.phone });
    }

    if (!user) {
      user = new userModel({
        name: address.name,
        email: address.email,
        phone: address.phone,
        address: formattedAddress,
      });
      await user.save();
    } else {
      user.name = address.name;
      user.email = address.email;
      user.address = formattedAddress;
      await user.save();
    }

    userId = user._id;

    // generate token for auto-login
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // create DB order (payment false for now)
    const order = new Order({
      userId,
      items: orderItems,
      amount: totalAmount,
      address,
      paymentMethod: paymentMethod || "ONLINE",
      payment: false,
      date: Date.now(),
      status: "Pending",
    });

    await order.save();

    // create razorpay order
    const options = {
      amount: Math.round(totalAmount * 100), // paise
      currency: "INR",
      receipt: `receipt_${order._id}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    // save razorpay order id on DB order
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json({ success: true, order, razorpayOrder, key: process.env.RAZORPAY_KEY_ID, token, userId: user._id });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// Verify payment signature and update order
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const generated_signature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.json({ success: false, message: "Invalid signature" });
    }

    // mark DB order as paid
    const updated = await Order.findByIdAndUpdate(orderId, {
      payment: true,
      paymentDetails: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      },
      status: "Processing",
    }, { new: true });

    res.json({ success: true, order: updated });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// ✅ USER ORDERS
export const userOrders = async (req, res) => {
  try {
    const userId = req.body.userId;

    const orders = await Order.find({ userId });

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};


// ✅ ALL ORDERS
export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ date: -1 });

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};


// ✅ DELETE ORDER
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await Order.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Order deleted successfully"
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};


// ✅ UPDATE STATUS
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await Order.findByIdAndUpdate(id, { status });

    res.json({
      success: true,
      message: "Order status updated"
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};