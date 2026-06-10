import express from "express";
import { getAbout, saveAbout } from "../controllers/aboutController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/", getAbout);

// 👇 multiple image uploads included
router.post("/save", upload.fields([
  { name: "storyImage", maxCount: 1 },
  { name: "redefineImage", maxCount: 1 }
]), saveAbout);

export default router;