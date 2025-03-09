import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product";
import importData from "../scripts/seed";

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";

async function startServer() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);

    const products = await Product.find({})

    if (products.length === 0) {
      await importData()
    }

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();
