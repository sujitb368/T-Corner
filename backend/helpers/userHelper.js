import bcrypt from "bcrypt";
import { JWT_SECRET_RESET_PASS } from "../config.js";
import jwt from "jsonwebtoken";
import ForgotPasswordTokenModel from "../models/forgotPasswordTokenModel.js";

const hashPassword = async (password) => {
  try {
    //salt round
    const saltRound = 10;
    //hash password with salt round 10
    const hashedPassword = await bcrypt.hash(password, saltRound);
    //return hashed password
    return hashedPassword;
  } catch (error) {
    console.log(`error while password hashing ${error}`);
  }
};

const removePassword = async (obj) => {
  try {
    const { password, ...user } = obj._doc;
    return user;
  } catch (error) {
    console.log("error in removePassword", error);
  }
};

const comparePassword = async (password, hashedPassword) => {
  try {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
  } catch (error) {
    console.log("error in compare password", error);
  }
};

// Generate a JWT and store it in MongoDB
const generateAndStoreToken = async (email, res) => {
  try {
    // Generate a unique token
    const token = jwt.sign({ email }, JWT_SECRET_RESET_PASS, {
      expiresIn: "1h",
    });

    //check if already exists
    const isRequestBefore = await ForgotPasswordTokenModel.findOne({ email });

    if (isRequestBefore) {
      return res.status(200).send({
        message: "Already requested before check your email",
        success: true,
      });
    }
    // Store the token in MongoDB
    const resetToken = new ForgotPasswordTokenModel({ email, token });

    //save the token in MongoDB
    await resetToken.save();

    //reset the token
    return { token, isTokenSaved: true };
  } catch (error) {
    console.log("Error in generateAndStoreToken ", error);
    return res.status(500).send({
      message: "Something went wrong during token generation",
      success: false,
      error,
    });
  }
};

export { hashPassword, removePassword, comparePassword, generateAndStoreToken };
