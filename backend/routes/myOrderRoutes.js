import express from "express";
const router = express.Router();

import {
  getMyOrderDetailsByOrderId,
  myOrders,
} from "../controllers/myOrderController.js";
import { isLogin } from "../middlewares/userMiddleware.js";

//api end point to place order in COD mode
router.post("/orders", isLogin, myOrders);
// router.post("/deleteFromCart/:productId", deleteFromCart);

//get order details by orderId
router.get("/orders/:orderId", isLogin, getMyOrderDetailsByOrderId);

export default router;
