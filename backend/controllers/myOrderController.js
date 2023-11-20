// Import necessary models for managing orders

import MyOrderModel from "../models/myOrderModel.js";
import OrderModel from "../models/orderModel.js";

// Function to retrieve all orders for a specific user
const myOrders = async (req, res) => {
  try {
    const { _id } = req.user;

    // Check if user ID is provided
    if (!_id) {
      return res.status(400).send({
        message: "Please provide customer",
        success: false,
      });
    }

    // Retrieve all orders for the user from the MyOrderModel
    const orders = await MyOrderModel.find({ user: _id });

    // Return a success response with the user's orders
    return res.status(200).send({
      message: "Orders",
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      message: "internal server error",
      success: false,
      error,
    });
  }
};

// Function to retrieve details of a specific order by its ID
const getMyOrderDetailsByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Check if order ID is provided
    if (!orderId) {
      return res.status(400).send({
        message: "Order Id is required",
        success: false,
        error: "Required fields are missing",
      });
    }

    // Find and retrieve details of the specific order by its ID from the MyOrderModel
    const details = await MyOrderModel.findOne(
      {
        "orders._id": orderId,
      },
      { "orders.$": 1 }
    );

    // Return a success response with the details of the specific order
    return res.status(200).send({
      message: "Order details",
      success: true,
      details: details.orders,
    });
  } catch (error) {
    // Return a server error response if there's an exception
    console.log(error);
    return res.status(500).send({
      message: "Internal Server Error",
      success: false,
      error,
    });
  }
};

// Export the myOrders and getMyOrderDetailsByOrderId functions
export { myOrders, getMyOrderDetailsByOrderId };
