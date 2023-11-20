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
  deleteProduct,
} from "../controllers/productController.js";
import { isAdmin, isLogin } from "../middlewares/userMiddleware.js";

// Endpoint to add a new product (requires user login and admin access)
router.post("/addProduct", isLogin, isAdmin, createProduct);

// Endpoint to update an existing product (requires user login and admin access)
router.put("/updateProduct/:productId", isLogin, isAdmin, updateProduct);

//to delete the product
// Endpoint to delete a product (requires user login and admin access)
router.delete("/delete/:productId", isLogin, isAdmin, deleteProduct);

// Endpoint to retrieve all products with pagination
router.get("/allproducts/:page", allProducts);

// Endpoint to retrieve a product by its ID
router.get("/getProductId/:productId", productById);

//get product quantity
router.post("/quantity", getQuantity);

// filter by category
router.post("/filter/:page", filterProduct);

//search product
router.get("/search", searchProduct);

// Export the router for use in other parts of the application
export default router;
