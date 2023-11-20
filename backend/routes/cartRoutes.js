// Import necessary modules and controllers
import express from "express";
const router = express.Router();

import { addToCart, deleteFromCart } from "../controllers/cartController.js";

// Endpoint for adding an item to the cart
router.post("/addToCart/:userId", addToCart);

// Endpoint for deleting an item from the cart
router.post("/deleteFromCart", deleteFromCart);

// Export the router for use in other parts of the application
export default router;
