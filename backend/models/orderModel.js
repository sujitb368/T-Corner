import mongoose from "mongoose";

// Define the CartItem schema
const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    orderItems: [
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
    orderStatus: {
      type: String,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    shippingAddress: {
      name: String,
      address: String,
      phone: String,
      pin: Number,
      landMark: String,
    },
    shippingCharge: {
      type: Number,
    },
    paymentDetails: {
      orderId: String,
      payerID: String,
      payerID: String,
      paymentSource: String,
      status: String,
    },
    orderDate: {
      type: Date,
    },
    expectedDeliveryDate: {
      type: Date,
    },
    deliveredDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Create the CartItem model
const OrderModel = mongoose.model("OrderModel", orderSchema);

export default OrderModel;
