import express from "express";
import {
  createCategory,
  getCategories,
} from "../../controllers/categoryController.js";
// import { isAdmin, isLogin } from "../../middlewares/userMiddleware";
const router = express.Router();

router.post("/create-category", createCategory);

//to fetch the categories
router.get("/categories", getCategories);

export default router;
