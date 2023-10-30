//import userModel
import userModel from "../models/userModel.js";
import {
  hashPassword,
  removePassword,
  comparePassword,
} from "../helpers/userHelper.js";

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

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
      message: "something went wrong unable to create user",
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
      .send({ message: "something went wrong", error, success: false });
  }
};

const testController = async (req, res) => {
  console.log("testController", req.user);
  return res.send({ user: req.user, message: "testing" });
};

export { signupController, loginController, testController };
