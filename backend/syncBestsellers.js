import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "./models/Order.js";
import Product from "./models/Product.js";

dotenv.config();

const syncBestsellers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for Sync");

    const orders = await Order.find({});
    console.log(`Found ${orders.length} orders. Processing...`);

    const productCounts = {};

    orders.forEach(order => {
      order.items?.forEach(item => {
        if (item.productId) {
          productCounts[item.productId] = (productCounts[item.productId] || 0) + (item.quantity || 1);
        }
      });
    });

    console.log("Calculated counts:", productCounts);

    let updated = 0;
    for (const [productId, count] of Object.entries(productCounts)) {
      await Product.findByIdAndUpdate(productId, { bestsellerCount: count });
      updated++;
    }

    console.log(`Successfully synced ${updated} products' bestsellerCount.`);
    process.exit(0);
  } catch (error) {
    console.error("Error during sync:", error);
    process.exit(1);
  }
};

syncBestsellers();
