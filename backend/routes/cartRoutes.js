import express from "express";
const router = express.Router();

import { addToCart, deleteFromCart } from "../controllers/cartController.js";

router.post("/addToCart/:userId", addToCart);
router.post("/deleteFromCart", deleteFromCart);

export default router;
