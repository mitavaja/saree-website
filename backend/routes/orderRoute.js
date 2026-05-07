import express from "express";
import {
  placeOrder,
  userOrders,
  allOrders,
  deleteOrder,
  updateOrderStatus
  , createPaymentOrder, verifyPayment
} from "../controllers/orderController.js";
import authUser from "../middleware/auth.js";

const router = express.Router(); // ✅ FIRST THIS

// ✅ ROUTES
router.post("/place", placeOrder);
router.post("/create-payment", createPaymentOrder);
router.post("/verify-payment", verifyPayment);
router.get("/user", authUser, userOrders);
router.get("/list", allOrders);
router.put("/update-status/:id", updateOrderStatus);
router.delete("/delete/:id", deleteOrder);

export default router;