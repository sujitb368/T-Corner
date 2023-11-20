import express from "express";
import {
  createCategory,
  getCategories,
} from "../../controllers/categoryController.js";
import { isLogin } from "../../middlewares/userMiddleware.js";
const router = express.Router();

router.post("/create-category", isLogin, createCategory);

//to fetch the categories
router.get("/categories", getCategories);

export default router;
