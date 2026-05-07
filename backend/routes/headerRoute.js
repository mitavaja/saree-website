import express from "express";
import { getHeader, updateHeader } from "../controllers/headerController.js";
import upload from "../middleware/multer.js";

const headerRouter = express.Router();

headerRouter.get("/get", getHeader);
headerRouter.post("/update", upload.single("logo"), updateHeader);

export default headerRouter;
