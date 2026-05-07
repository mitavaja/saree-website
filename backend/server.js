import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import adminRoute from "./routes/adminRoute.js";
import productRoute from "./routes/productRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import trendingRoute from "./routes/trendingRoute.js";
import bannerRoute from "./routes/bannerRoute.js";
import videoRoute from "./routes/videoRoute.js";
import cartRoute from "./routes/cartRoute.js"
import wishlistRoute from "./routes/wishlistRoute.js"
import orderRoute from "./routes/orderRoute.js";
import userRoute from "./routes/userRoute.js";
import policyRoute from "./routes/policyRoute.js";
import footerRoute from "./routes/footerRoute.js";
import aboutRoute from "./routes/aboutRoute.js";
import contactRoute from "./routes/contactRoute.js";
import deliveryFeeRoute from "./routes/deliveryFeeRoute.js";
import headerRoute from "./routes/headerRoute.js";
import brandStoryRoute from "./routes/brandStoryRoute.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB Connected"))
.catch((err)=> console.log(err));

// routes
app.use("/api/admin", adminRoute);
app.use("/api/product", productRoute);
app.use("/api/category", categoryRoute);
app.use("/api/trending", trendingRoute);
app.use("/api/banner", bannerRoute);
app.use("/api/video", videoRoute);
app.use("/api/cart",cartRoute)
app.use("/api/wishlist",wishlistRoute)
app.use("/api/order",orderRoute)
app.use("/api/user", userRoute)
app.use("/api/policy", policyRoute);
app.use("/api/footer", footerRoute);
app.use("/api/about", aboutRoute);
app.use("/api/contact", contactRoute);
app.use("/api/delivery", deliveryFeeRoute);
app.use("/api/header", headerRoute);
app.use("/api/brand-story", brandStoryRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`);
});