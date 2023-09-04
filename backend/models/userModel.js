import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

//define the user schema
const user = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    role: {
      type: Number,
      trim: true,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profilePic: {
      type: String,
      default:
        "https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png",
    },
  },
  { timestamps: true }
);
// Create the user model from the schema
const UserModel = mongoose.model("UserModel", user);

export default UserModel;
