// routes/brandStoryRoutes.js

import express from "express";
const router = express.Router();

import {
  getBrandStory,
  saveBrandStory,
} from "../controllers/brandStoryController.js";

import upload from "../middleware/multer.js"; // your multer config

router.get("/", getBrandStory);
router.post("/", upload.single("video"), saveBrandStory);

export default router;