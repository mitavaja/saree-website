import express from "express";
import multer from "multer";
import path from "path";
import {
  getBanners,
  addBanner,
  updateBanner,
  deleteBanner,
} from "../controllers/bannerController.js";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/banners/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Routes
router.get("/list", getBanners);
router.post("/", upload.single("image"), addBanner);
router.put("/:id", upload.single("image"), updateBanner);
router.delete("/:id", deleteBanner);

export default router;