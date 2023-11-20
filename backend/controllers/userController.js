// Import necessary modules, libraries, and models
import { frontEndUrl } from "../config.js";
import {
  hashPassword,
  removePassword,
  comparePassword,
  generateAndStoreToken,
} from "../helpers/userHelper.js";

import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_SECRET_RESET_PASS } from "../config.js";
import UserModel from "../models/userModel.js";
import { sendEmail } from "../helpers/nodeMailer.js";
import { isValidToken } from "../middlewares/userMiddleware.js";
import ResetPasswordModel from "../models/forgotPasswordTokenModel.js";

/**
 * Controller function to handle user sign-up.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const signupController = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    //validation
    //if any of this are not provided, then return with status code 400
    if (!name || !email || !password || !phone) {
      return res.status(400).send({
        message: "All fields are required",
        success: false,
      });
    }
    //find user by email to check if user already exists
    const isUserExist = await UserModel.findOne({ email });

    //if user exist already then return with status code 400
    if (isUserExist) {
      return res.status(400).send({
        message: "User all ready exists",
        success: false,
      });
    }
    const hashedPassword = await hashPassword(password);
    //user details
    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      phone,
    });
    //save user to database
    await user.save();
    //user details object without password filed
    const userDetails = await removePassword(user);
    return res.status(201).send({
      success: true,
      message: "User successfully created",
      user: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong unable to create user",
      message2: error.message,
      success: false,
    });
  }
};

/**
 * Controller function to handle user login.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const loginController = async (req, res) => {
  try {
    //user login credentials
    const { email, password } = req.body;
    console.log("user login", email, password);
    //validate email and password
    if (!email || !password) {
      return res.status(400).send({
        message: "please enter your email and password",
        success: false,
      });
    }

    //find user by email
    const user = await UserModel.findOne({ email });

    //check if user provided password is correct or not
    const checkPassword = await comparePassword(password, user.password);

    //if user provided password is correct
    if (checkPassword) {
      //user details object without password field
      const userDetails = await removePassword(user);
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "1day",
      });

      return res.status(200).send({
        success: true,
        message: "login successful",
        token,
        user: userDetails,
      });
    } else {
      return res
        .status(404)
        .send({ message: "Email or password is incorrect", success: false });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Something went wrong", error, success: false });
  }
};

/**
 * Controller function to authorize normal user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const isLoggedIn = async (req, res) => {
  return res.status(200).send({
    message: "access granted",
    success: true,
    loggedIn: true,
  });
};

/**
 * Controller function to get all users excluding admins.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getAllUsersController = async (req, res) => {
  try {
    const { page } = req.params ?? 1;

    const perPage = req.query?.perPage ?? 10;

    //here page will be type cast to number if it is in string format '1' due to minus(-)
    const skip = (page - 1) * 10;

    const users = await UserModel.find({ isAdmin: false }, { password: 0 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(10);
    //length of the filtered result
    const totalUsers = users.length;

    return res.status(200).send({
      message: "All users",
      success: true,
      users,
      totalPage: Math.ceil(totalUsers / perPage),
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Something went wrong", error, success: false });
  }
};

/**
 * Controller function to get users based on search query.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getSearchedUser = async (req, res) => {
  try {
    const { page = 1, query, perPage = 10 } = req.query;

    //here page will be type cast to number if it is in string format '1' due to minus(-)
    const skip = (page - 1) * 10;

    // Use a regular expression to perform a case-insensitive search on product names and descriptions
    const regex = new RegExp(query, "i");

    const users = await UserModel.find(
      {
        $or: [
          { name: { $regex: regex } },
          { email: { $regex: regex } },
          { phone: { $regex: regex } },
        ],
      },
      { password: 0 }
    )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(10);
    //length of the filtered result
    const totalUsers = users.length;

    return res.status(200).send({
      message: "Searched users",
      success: true,
      users,
      totalPage: Math.ceil(totalUsers / perPage),
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Something went wrong", error, success: false });
  }
};

/**
 * Controller function to delete a user by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const deleteUserController = async (req, res) => {
  try {
    //get user id from request params
    const { userId } = req.params;

    //remove user from database with given user id
    await UserModel.findByIdAndRemove({ _id: userId });

    return res.status(200).send({
      message: "User successfully deleted`",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Something went wrong", error, success: false });
  }
};

/**
 * Controller function to handle forgot password requests.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const forgotPasswordController = async (req, res) => {
  try {
    //get email of user from request params
    const { email } = req.params;

    // find user by email
    const user = await UserModel.findOne({ email });

    // if user is not found return response
    if (!user) {
      return res.status(400).send({ message: "Invalid user", success: false });
    }

    // generate password reset token
    const resetToken = await generateAndStoreToken(email, res);

    if (resetToken.isTokenSaved === true) {
      // send reset-password email
      const emailConfig = {
        to: email,
        subject: "Reset Password", // Subject line
        text: "Please click the link to reset your password", // plain text body
        html: `<a href=${frontEndUrl}/reset-password/${resetToken.token}>${frontEndUrl}/reset-password/${resetToken.token}</a>`, // html body
      };
      const isSend = await sendEmail(emailConfig);

      if (isSend) {
        return res.status(200).send({
          message: "Reset password email has sent check your inbox",
          success: true,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Something went wrong",
      success: false,
      error,
    });
  }
};

/**
 * Controller function to reset user password.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const resetPassword = async (req, res) => {
  try {
    //get token from req headers
    const token = req.headers.authorization;

    //destructure from request body
    const { email, password } = req.body;

    //validation
    //if any of this are not provided, then return with status code 400
    if (!email || !password) {
      return res.status(400).send({
        message: "All fields are required",
        success: false,
      });
    }

    // check token is valid before setting new password
    const verifyToken = await isValidToken(token, JWT_SECRET_RESET_PASS);

    //get reset token from reset password model
    const storedResetToken = await ResetPasswordModel.findOne({ email });

    //if not validated return response
    if (verifyToken && token !== storedResetToken?.token) {
      return res.status(400).send({ message: "invalid token" });
    }

    //hash password
    const hashedPassword = await hashPassword(password);

    //find user by email to check if user already exists
    const isUserExist = await UserModel.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    //remove from db
    await ResetPasswordModel.findOneAndDelete({ email });

    //if user exist already then return with status code 400
    if (isUserExist) {
      return res.status(200).send({
        message: "password changed successfully",
        success: true,
      });
    }
    return res.status(400).json({
      message: "Something went wrong ",
      success: false,
    });
  } catch (error) {
    console.log("Error in reset password", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error,
    });
  }
};

/**
 * Controller function to get the total number of normal users.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getTotalUsers = async (req, res) => {
  try {
    //total users excluding admin users
    const totalUsers = await UserModel.find({ isAdmin: false }).count();

    return res.status(200).json({
      message: "Total users",
      success: true,
      totalUsers,
    });
  } catch (error) {
    console.log("Error in get total user", error);
    return res.status(500).json({
      message: error.message ?? "Something went wrong",
      success: false,
      error,
    });
  }
};

/**
 * Controller function to edit user profile.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const editUserProfile = async (req, res) => {
  try {
    // get user id from request params
    const { userId } = req.params;

    // get user from user model
    const user = await UserModel.findByIdAndUpdate({ _id: userId }, req.body, {
      new: true,
    });

    return res.status(200).send({
      message: "User profile successfully updated",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Something went wrong", error, success: false });
  }
};

export {
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
};
