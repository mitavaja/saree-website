import express from "express";
import authUser from "../middleware/auth.js";
import {
  getUserProfile,
  updateUserProfile,
  getUserOrders,
  sendOtp,
  verifyOtp
} from "../controllers/userController.js";

const router = express.Router();

// ✅ ROUTES
router.get("/profile", authUser, getUserProfile);
router.post("/update", authUser, updateUserProfile);
router.get("/orders", authUser, getUserOrders);
router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);

export default router;