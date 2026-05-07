import express from "express";
import { sendOtp, verifyOtp, getCustomerStats } from "../controllers/adminController.js";
import authUser from "../middleware/auth.js";

const router = express.Router();

// Send OTP
router.post("/send-otp", sendOtp);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// NEW: Admin dashboard stats (protected)
router.get("/stats", authUser, getCustomerStats);

export default router;
