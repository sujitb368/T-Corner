import express from "express";
const router = express.Router();

import {
  captureOrder,
  createOrder,
  getOrderDetailsByOrderId,
  placeOrderController,
  getOrders,
  changeOrderStatus,
} from "../controllers/orderController.js";
import { isLogin } from "../middlewares/userMiddleware.js";

//api end point to place order in COD mode
router.post("/order", isLogin, placeOrderController);
// router.post("/deleteFromCart/:productId", deleteFromCart);

//get order details by orderId
router.get("/orders/:orderId", isLogin, getOrderDetailsByOrderId);

// end points to intialize order using paypal
router.post("/", async (req, res) => {
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const cart = req.body;
    console.log("cart", cart);
    const { jsonResponse, httpStatusCode } = await createOrder(cart);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

router.post("/:orderID/capture", async (req, res) => {
  try {
    console.log("captured order id", req.params.orderID);
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});

router.get("/get-orders", getOrders);

router.put("/change-status/:orderId", changeOrderStatus);

export default router;
