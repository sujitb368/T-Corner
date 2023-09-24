import express from "express";
import {
  createCategory,
  getCategories,
} from "../../controllers/categoryController.js";
import { addProduct } from "../../controllers/admin/addProductController.js.js";
import { isLogin } from "../../middlewares/userMiddleware.js";
const router = express.Router();

router.post("/create-category", createCategory);

//to fetch the categories
router.get("/categories", getCategories);

//add product
router.post("/addproduct", isLogin, addProduct);

export default router;
