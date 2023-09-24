import express from "express";
const router = express.Router();

import { myOrders } from "../controllers/myOrderController.js";
import { isLogin } from "../middlewares/userMiddleware.js";

//api end point to place order in COD mode
router.post("/orders", isLogin, myOrders);
// router.post("/deleteFromCart/:productId", deleteFromCart);

export default router;
