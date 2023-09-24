import express from "express";
const app = express();

import cors from "cors";

import mongoose from "mongoose";

// Import config file
import { dbURL } from "./config.js";

// import { dirname } from "path";
// import { fileURLToPath } from "url";

import "dotenv/config";

// Import routes
// Import user routes
import userRoutes from "./routes/userRoutes.js";
// Import product routes
import productRoutes from "./routes/productRoutes.js";
// Import rating routes
import ratingRoutes from "./routes/ratingRoutes.js";
// Import category routes
import categoryRoutes from "./routes/admin/categoryRoutes.js";
// Import cart routes
import cartRoutes from "./routes/cartRoutes.js";
// Import shipping routes
import shippingRoutes from "./routes/shippingRoutes.js";
// Import order routes
import orderRoutes from "./routes/orderRoutes.js";
// Import myOrders Routes
import myOrdersRoutes from "./routes/myOrderRoutes.js";
// Import files Routes
import filesRoutes from "./routes/filesRoutes.js";

//connect database
mongoose.connect(dbURL);

//middleware
app.use(cors());
app.use(express.json());

//server port number
const port = process.env.port || 8000;

// Get the directory name of the current module
// const __filename = fileURLToPath(import.meta.url);
// global.__dirname = dirname(__filename);

//routes configuration
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/rating", ratingRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/shipping", shippingRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/myorders", myOrdersRoutes);
app.use("/api/v1/files", filesRoutes);

//admin routes
app.use("/api/v1/admin/category", categoryRoutes);
app.use("/api/v1/admin/files", filesRoutes);
app.use("/api/v1/admin/product", productRoutes);

app.listen(port, (err, res) => {
  console.log("Server listening at: " + port);
});
