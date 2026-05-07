import express from "express";
import upload from "../middleware/videoUpload.js";
import { addVideo, getVideos, deleteVideo } from "../controllers/videoController.js";

const router = express.Router();

router.post("/add", upload.single("video"), addVideo);

router.get("/list", getVideos);

router.delete("/delete/:id", deleteVideo);

export default router;