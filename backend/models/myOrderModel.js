import mongoose from "mongoose";

const myOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    orders: [
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
        myRating: { type: Number, min: 1, max: 5 }, // Assuming a rating from 1 to 5
        review: { type: String, trim: true }, // User's review of the product
      },
    ],
  },
  { timestamps: true }
);

const MyOrderModel = mongoose.model("MyOrderModel", myOrderSchema);

export default MyOrderModel;
