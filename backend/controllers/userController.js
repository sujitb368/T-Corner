//import userModel
import userModel from "../models/userModel.js";
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

//user sign-up/create controller
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
    const isUserExist = await userModel.findOne({ email });

    //if user exist already then return with status code 400
    if (isUserExist) {
      return res.status(400).send({
        message: "User allready exists",
        success: false,
      });
    }
    const hashedPassword = await hashPassword(password);
    //user details
    const user = new userModel({
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

//user login controller
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
    const user = await userModel.findOne({ email });

    //check if user provided password is correct or not
    const checkPassword = await comparePassword(password, user.password);

    //if user provided password is correct
    if (checkPassword) {
      //user details object without password field
      const userDetails = await removePassword(user);
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "1d",
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

const testController = async (req, res) => {
  console.log("testController", req.user);
  return res.send({ user: req.user, message: "testing" });
};

const getAllUsersController = async (req, res) => {
  try {
    const { page } = req.params ?? 0;
    const skip = page * 10;
    const users = await UserModel.find({}, { password: 0 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(10);
    return res.status(200).send({
      message: "All users",
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Something went wrong", error, success: false });
  }
};

const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.params;

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

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Invalid user", success: false });
    }

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

const resetPassword = async (req, res) => {
  try {
    const token = req.headers.authorization;
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

    const storedResetToken = await ResetPasswordModel.findOne({ email });

    if (verifyToken && token !== storedResetToken?.token) {
      return res.status(400).send({ message: "invalid token" });
    }

    const hashedPassword = await hashPassword(password);

    //find user by email to check if user already exists
    const isUserExist = await userModel.updateOne(
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

const getTotalUsers = async (req, res) => {
  try {
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

export {
  signupController,
  loginController,
  testController,
  getAllUsersController,
  deleteUserController,
  forgotPasswordController,
  resetPassword,
  getTotalUsers,
};
