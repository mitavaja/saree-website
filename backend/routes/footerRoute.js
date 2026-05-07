import express from "express";
import {
  getFooter,
  updateFooter,
  upload,
} from "../controllers/FooterController.js";

const router = express.Router();

// IMPORTANT PATHS
router.get("/settings", getFooter);
router.put("/settings", upload.single("logo"), updateFooter);

export default router;