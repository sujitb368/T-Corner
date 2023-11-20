import express from "express";
const router = express.Router();

import {
  captureOrder,
  createOrder,
  getOrderDetailsByOrderId,
  placeOrderController,
  getOrders,
  changeOrderStatus,
  getSearchedOrders,
  getNewOrders,
  getShippedOrders,
} from "../controllers/orderController.js";
import { isAdmin, isLogin } from "../middlewares/userMiddleware.js";

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

// API endpoint to retrieve order details by orderId
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

// Endpoint to get all orders (requires admin and user login)
router.get("/get-orders", isLogin, isAdmin, getOrders);

// Endpoint to change the status of an order (requires admin and user login)
router.put("/change-status/:orderId", isLogin, isAdmin, changeOrderStatus);

//get order details by orderId (requires admin and user login)
router.get("/search-orders", isLogin, isAdmin, getSearchedOrders);

// Endpoint to get new orders (requires admin and user login)
router.get("/newOrders-orders", isLogin, isAdmin, getNewOrders);

// Endpoint to get shipped orders (requires admin and user login)
router.get("/shipped-orders", isLogin, isAdmin, getShippedOrders);

// Export the router for use in other parts of the application
export default router;
