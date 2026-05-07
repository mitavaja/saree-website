import express from "express";
import { getAbout, saveAbout } from "../controllers/aboutController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/", getAbout);

// 👇 image upload included
router.post("/save", upload.single("storyImage"), saveAbout);

export default router;