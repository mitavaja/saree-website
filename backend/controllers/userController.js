import userModel from "../models/User.js";
import Order from "../models/Order.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const OTP_EXPIRE_MINUTES = 5;

// Configure nodemailer globally
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

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

// Send OTP
export const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    // Verify that the customer has placed at least one order using this email
    const hasOrder = await Order.findOne({ "address.email": new RegExp(`^${normalizedEmail}$`, "i") });
    
    if (!hasOrder) {
      return res.status(400).json({ 
        success: false, 
        message: "No account exists. Please place an order first before logging in." 
      });
    }

    let user = await userModel.findOne({ email: normalizedEmail });
    if (!user) {
      user = new userModel({ email: normalizedEmail });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + OTP_EXPIRE_MINUTES * 60000);
    await user.save();

    let emailStatus = 'skipped';
    try {
      if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
        console.log('[USER_OTP] ⚠️ SMTP credentials missing - email skipped');
      } else {
        await transporter.sendMail({
          from: `"Saree Website" <${process.env.SMTP_EMAIL}>`,
          to: normalizedEmail,
          subject: "Your Login OTP",
          text: `Your login OTP is: ${otp}\n\nValid for ${OTP_EXPIRE_MINUTES} minutes only.`,
          html: `<h2>Your Login OTP</h2><p><strong>${otp}</strong></p><p>Valid for <strong>${OTP_EXPIRE_MINUTES} minutes</strong>.</p>`
        });
        emailStatus = 'sent';
      }
    } catch (emailErr) {
      console.error('[USER_OTP] ❌ Email failed:', emailErr.message);
      emailStatus = 'failed';
    }

    res.json({ 
      success: true,
      message: "OTP generated successfully",
      emailStatus
    });
  } catch (err) {
    res.status(500).json({ success: false, message: `Failed to generate OTP: ${err.message}` });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const user = await userModel.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized - User not found" });

    if (!user.otp || user.otp.trim() !== otp.trim()) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (!user.otpExpiry || new Date() > user.otpExpiry) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "999d" }
    );

    res.json({ 
      success: true,
      token,
      user,
      message: "Login successful"
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
};