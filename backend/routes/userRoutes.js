// Import necessary modules and controllers for managing users
import express from "express";

import {
  signupController,
  loginController,
  isLoggedIn,
  getAllUsersController,
  deleteUserController,
  forgotPasswordController,
  resetPassword,
  getTotalUsers,
  editUserProfile,
  getSearchedUser,
} from "../controllers/userController.js";

import { isAdmin, isLogin } from "../middlewares/userMiddleware.js";

//router object
const router = express.Router();

//user creation routes | signup
router.post("/signup", signupController);

//login user routes
router.post("/login", loginController);

//protected User routes
router.get("/isLoggedIn", isLogin, isLoggedIn);

//routes to get all users
router.get("/all-users/:page", isLogin, getAllUsersController);

//routes to get all users
router.get("/search-users", isLogin, getSearchedUser);

//routes to delete user
router.delete("/delete-user/:userId", isLogin, isAdmin, deleteUserController);

// forgot password end point will send a email with password reset link
router.post("/forgot-password/:email", forgotPasswordController);

// reset password
router.put("/reset-password", resetPassword);

router.get("/total-users", getTotalUsers);

router.put("/edit/:userId", editUserProfile);

export default router;
