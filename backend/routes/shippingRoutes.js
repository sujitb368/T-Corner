import express from "express";

import { isLogin } from "../middlewares/userMiddleware.js";
import {
  addShippingAddress,
  getShippingAddress
} from "../controllers/shippingAddressController.js";

//router object
const router = express.Router();

//add shipping address routes
router.post("/shipping-address/:user", addShippingAddress);

//get shipping address routes
router.get("/shipping-address/:user", getShippingAddress);
export default router;
