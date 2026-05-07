import express from "express";
import {
  setDeliveryFee,
  getDeliveryFee,
  getAllDeliveryFees,
  deleteDeliveryFee
} from "../controllers/deliveryFeeController.js";

const router = express.Router();

// Admin
router.post("/set", setDeliveryFee);

// User
router.get("/all", getAllDeliveryFees);
router.get("/:state", getDeliveryFee);
router.delete("/:id", deleteDeliveryFee);

export default router;