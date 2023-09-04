import express from "express";
const router = express.Router();

import {
  createProduct,
  allProducts,
  productById,
} from "../controllers/productController.js";

router.post("/addProduct", createProduct);

router.get("/allproducts/:page", allProducts);
router.get("/getProductId/:productId", productById);

export default router;
