import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import userModel from "../models/userModel.js";

const isLogin = (req, res, next) => {
  try {
    //get authorization token from request headers
    const { authorization } = req.headers;
    //if authorization token is not present then return with status code 401
    if (!authorization) {
      return res
        .status(401)
        .send({ message: "unauthorized user", success: false });
    }
    //if authorization token is present then get token
    const token = authorization.includes("Bearer")
      ? authorization.replace("Bearer ", "")
      : authorization;

    // verify authorization token
    jwt.verify(token, JWT_SECRET, async (err, payload) => {
      if (err) {
        return res
          .status(401)
          .send({ message: "unauthorized user", success: false });
      }
      // if token is valid find user and add to request object
      const { _id } = payload;
      const user = await userModel.findById(_id);
      req.user = user;
      next();
    });
  } catch (error) {
    console.log("error in isLogin middleware", error);
    return res.status(500).send({
      message: "error in isLogin middleware",
      error,
      success: false,
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    // get role of login user from request body
    const { role } = req.body;
    //check role of user from DB
    //get user by id
    // const user = await userModel.findById(req.user._id);
    if (role !== 1) {
      return res.status(200).send({
        message: "Unauthorised user",
        success: false,
      });
    } else {
      next();
    }
  } catch (error) {
    console.log("error in isAdmin middleware", error);
    return res.status(500).send({
      message: "error in isAdmin middleware",
      error,
      success: false,
    });
  }
};

export { isLogin, isAdmin };
