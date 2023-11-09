import express from "express";
const router = express.Router();

import {
  updateProduct,
  createProduct,
  allProducts,
  productById,
  filterProduct,
  getQuantity,
  searchProduct,
} from "../controllers/productController.js";

router.post("/addProduct", createProduct);

router.put("/updateProduct/:productId", updateProduct);

router.get("/allproducts/:page", allProducts);

router.get("/getProductId/:productId", productById);

//get product quantity
router.post("/quantity", getQuantity);

// filter by category
router.post("/filter/:page", filterProduct);

//search product
router.get("/search", searchProduct);

export default router;
