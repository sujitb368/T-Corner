import express from "express";

import {
  signupController,
  loginController,
  testController,
  getAllUsersController,
  deleteUserController,
  forgotPasswordController,
  resetPassword,
  getTotalUsers,
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

// forgot password end point will send a email with password reset link
router.post("/forgot-password/:email", forgotPasswordController);

// reset password
router.put("/reset-password", resetPassword);

router.get("/total-users", getTotalUsers);

export default router;
