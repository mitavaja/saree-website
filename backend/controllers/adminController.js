import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
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

// Send OTP
export const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    let admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin) {
      if (normalizedEmail !== "dharmikdashlani@gmail.com") {
        return res.status(401).json({ message: "Unauthorized" });
      }
      admin = new Admin({ email: normalizedEmail });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otp = otp;
    admin.otpExpiry = new Date(Date.now() + OTP_EXPIRE_MINUTES * 60000);
    await admin.save();

    console.log(`[ADMIN_OTP] ✅ Generated OTP ${otp} for ${normalizedEmail} (expires in ${OTP_EXPIRE_MINUTES}min)`);

    // Try to send email (non-blocking)
    let emailStatus = 'skipped';
    try {
      if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
        console.log('[ADMIN_OTP] ⚠️ SMTP credentials missing - email skipped');
      } else {
        console.log('[ADMIN_OTP] 📧 Attempting to send email...');
        await transporter.sendMail({
          from: `"Admin Panel" <${process.env.SMTP_EMAIL}>`,
          to: normalizedEmail,
          subject: "Your Admin Login OTP",
          text: `Your admin login OTP is: ${otp}\n\nValid for ${OTP_EXPIRE_MINUTES} minutes only.\nDo not share this OTP with anyone.`,
          html: `<h2>Your Admin Login OTP</h2><p><strong>${otp}</strong></p><p>Valid for <strong>${OTP_EXPIRE_MINUTES} minutes</strong>.</p><p>Do not share this OTP.</p>`
        });
        console.log('[ADMIN_OTP] ✅ Email sent successfully');
        emailStatus = 'sent';
      }
    } catch (emailErr) {
      console.error('[ADMIN_OTP] ❌ Email failed:', emailErr.message);
      console.error('[ADMIN_OTP] Full email error stack:', emailErr.stack);
      emailStatus = 'failed';
      // Continue - OTP is generated regardless
    }

    res.json({ 
      success: true,
      message: "OTP generated successfully - check your email or server console",
      emailStatus,
      email: normalizedEmail,
      otpExpiryMinutes: OTP_EXPIRE_MINUTES
    });
  } catch (err) {
    console.error('[ADMIN_OTP] 💥 CRITICAL ERROR:', err.message);
    console.error('[ADMIN_OTP] Full stack:', err.stack);
    res.status(500).json({ 
      success: false,
      message: `Failed to generate OTP: ${err.message}` 
    });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (!admin) return res.status(401).json({ message: "Unauthorized - Admin not found" });

    console.log("[VERIFY_OTP] Received:", otp.trim(), "Stored:", admin.otp?.trim());
    console.log("[VERIFY_OTP] Expiry:", admin.otpExpiry, "Now:", new Date());

    if (!admin.otp || admin.otp.trim() !== otp.trim()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!admin.otpExpiry || new Date() > admin.otpExpiry) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Clear OTP
    admin.otp = null;
    admin.otpExpiry = null;
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role || "admin" },
      JWT_SECRET,
      { expiresIn: "999d" }
    );

    console.log(`[ADMIN_LOGIN] ✅ ${admin.email} logged in successfully`);

    res.json({ 
      success: true,
      token,
      message: "Login successful"
    });
  } catch (err) {
    console.error("[VERIFY_OTP] Error:", err);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};

// Get customer stats for admin dashboard
export const getCustomerStats = async (req, res) => {
  try {
    const orders = await Order.find({}, 'address.email');
    const uniqueEmails = new Set();
    orders.forEach(order => {
      if (order.address && order.address.email) {
        uniqueEmails.add(order.address.email.toLowerCase().trim());
      }
    });
    const totalCustomers = uniqueEmails.size;
    
    res.json({ 
      success: true, 
      stats: { 
        totalCustomers 
      } 
    });
  } catch (error) {
    console.error("[STATS] Error:", error);
    res.json({ success: false, message: error.message });
  }
};

