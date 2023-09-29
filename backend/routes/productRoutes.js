import express from "express";
const router = express.Router();

import {
  createProduct,
  allProducts,
  productById,
  filterProduct,
  getQuantity,
} from "../controllers/productController.js";

router.post("/addProduct", createProduct);

router.get("/allproducts/:page", allProducts);

router.get("/getProductId/:productId", productById);

//get product quantity
router.post("/quantity", getQuantity);

// filter by category
router.get("/filter", filterProduct);

export default router;
