// Import necessary modules and controllers for managing ratings
import express from "express";

import { isLogin } from "../middlewares/userMiddleware.js";
import { createRatings } from "../controllers/ratingController.js";

//router object
// Create an Express router
const router = express.Router();

// Endpoint to create a new rating
router.post("/rating", isLogin, createRatings);
export default router;
