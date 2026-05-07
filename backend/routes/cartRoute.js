import express from "express";
import { addToCart,getCart,removeCartItem } from "../controllers/cartController.js";

const router = express.Router()

router.post("/add",addToCart)
router.get("/user/:userId",getCart)
router.post("/remove",removeCartItem)

export default router