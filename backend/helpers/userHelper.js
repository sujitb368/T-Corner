// Import necessary libraries and modules
// Import bcrypt for password hashing,
// JWT for token generation, and the ForgotPasswordTokenModel.

import bcrypt from "bcrypt";
import { JWT_SECRET_RESET_PASS } from "../config.js";
import jwt from "jsonwebtoken";
import ForgotPasswordTokenModel from "../models/forgotPasswordTokenModel.js";

// Function to Hash Password
// asynchronous function named hashPassword to hash the given password with a salt round of 10.

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

// Function to Remove Password
// asynchronous function named removePassword to exclude the password field from the user object.
const removePassword = async (obj) => {
  try {
    // Destructure the password field from the user object
    const { password, ...user } = obj._doc;

    // Return the user object without the password
    return user;
  } catch (error) {
    console.log("error in removePassword", error);
  }
};

// Function to Compare Password
// asynchronous function named comparePassword to compare a password with its hashed version.
const comparePassword = async (password, hashedPassword) => {
  try {
    // Use bcrypt to compare the provided password with the hashed password
    const result = await bcrypt.compare(password, hashedPassword);
    // Return the result of the comparison
    return result;
  } catch (error) {
    console.log("error in compare password", error);
  }
};

// Function to Generate and Store Token
// asynchronous function named generateAndStoreToken to create a JWT and store it in MongoDB.

const generateAndStoreToken = async (email, res) => {
  try {
    // Generate a unique token using the user's email and the reset password secret key
    const token = jwt.sign({ email }, JWT_SECRET_RESET_PASS, {
      expiresIn: "1h",
    });

    //check if already exists
    const isRequestBefore = await ForgotPasswordTokenModel.findOne({ email });

    // If a request has been made before, return a success message
    if (isRequestBefore) {
      return res.status(200).send({
        message: "Already requested before check your email",
        success: true,
      });
    }
    // Store the token in MongoDB
    // Create a new document for the token and email in MongoDB
    const resetToken = new ForgotPasswordTokenModel({ email, token });

    //save the token in MongoDB
    await resetToken.save();

    //reset the token
    // Return the generated token along with a flag indicating successful storage
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

// Export the password-related functions for use in other modules
export { hashPassword, removePassword, comparePassword, generateAndStoreToken };
