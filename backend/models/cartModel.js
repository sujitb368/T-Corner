import mongoose from "mongoose";

// Define the CartItem schema
const cartItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    cartItems: [
      {
        name: { type: String, required: true },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Reference to the Product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
        },
        color: {
          type: String,
        },
        size: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

// Create the CartItem model
const CartItem = mongoose.model("CartItem", cartItemSchema);

export default CartItem;
