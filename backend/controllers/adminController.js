import express from "express";

// admin login
const adminLogin = async (req, res) => {
  try {
    const admin = await userModel.findOne({ email });
    if (!admin) {
    }
  } catch (error) {}
};
