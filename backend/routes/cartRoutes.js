import express from "express";
const router = express.Router();

import { addToCart } from "../controllers/cartController.js";

router.post("/addToCart/:userId", addToCart);

export default router;
