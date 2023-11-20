// Import necessary modules and controllers for managing shipping addresses
import express from "express";

import { isLogin } from "../middlewares/userMiddleware.js";
import {
  addShippingAddress,
  getShippingAddress,
  editShippingAddress,
} from "../controllers/shippingAddressController.js";

//router object
// Create an Express router
const router = express.Router();

//add shipping address routes
router.post("/shipping-address/:user", isLogin, addShippingAddress);

//get shipping address routes
router.get("/shipping-address/:user", isLogin, getShippingAddress);

//edit shipping address routes
router.put("/edit-address/:user", isLogin, editShippingAddress);

export default router;
