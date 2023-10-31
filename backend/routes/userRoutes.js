import express from "express";

import {
  signupController,
  loginController,
  testController,
  getAllUsersController,
  deleteUserController,
} from "../controllers/userController.js";

import { isAdmin, isLogin } from "../middlewares/userMiddleware.js";

//router object
const router = express.Router();

//user creation routes | signup
router.post("/signup", signupController);

//login user routes
router.post("/login", loginController);

router.post("/test-user", isLogin, testController);

//routes to get all users
router.get("/all-users", isLogin, getAllUsersController);

//routes to delete user
router.delete("/delete-user/:userId", isLogin, isAdmin, deleteUserController);

export default router;
