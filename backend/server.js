import express from "express";
const app = express();

import cors from "cors";

import mongoose from "mongoose";

// Import config file
import { dbURL } from "./config.js";

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

//connect database
mongoose.connect(dbURL);

//middleware
app.use(cors());
app.use(express.json());

//server port number
const port = process.env.port || 8000;

//routes configuration
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/rating", ratingRoutes);
app.use("/api/v1/cart", cartRoutes);

//admin routes
app.use("/api/v1/admin/category", categoryRoutes);

app.listen(port, (err, res) => {
  console.log("Server listening at: " + port);
});
