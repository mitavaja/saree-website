import express from "express";
const router = express.Router();

import {
  createTrending,
  getTrending,
  getSingleTrending,
  updateTrending,
  deleteTrending,
} from "../controllers/trendingController.js";

import upload from "../middleware/upload.js";

// CRUD
router.post("/", upload.single("image"), createTrending);
router.get("/", getTrending);
router.get("/:id", getSingleTrending);
router.put("/:id", upload.single("image"), updateTrending);
router.delete("/:id", deleteTrending);

export default router; // ✅ IMPORTANT