import mongoose from "mongoose";

// const { ObjectId } = mongoose.Schema.Types;

const tokenSchema = new mongoose.Schema({
  email: { type: String, trim: true, unique: true, required: true },
  token: { type: String, trim: true, unique: true, required: true },
});

const resetPasswordModel = mongoose.model("ResetPasswordModel", tokenSchema);

export default resetPasswordModel;
