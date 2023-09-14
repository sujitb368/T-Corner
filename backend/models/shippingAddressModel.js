import mongoose from "mongoose";

const ShippingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
    required: true,
  },
  addresses: [
    {
      fName: {
        type: String,
        required: true,
        trim: true,
      },
      lName: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
      landMark: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
      pin: {
        type: Number,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
        required: true,
      },
      isPrimary: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const ShippingModel = mongoose.model("ShippingModel", ShippingSchema);

export default ShippingModel;
