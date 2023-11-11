import MyOrderModel from "../models/myOrderModel.js";
import OrderModel from "../models/orderModel.js";

const myOrders = async (req, res) => {
  try {
    const { _id } = req.user;

    if (!_id) {
      return res.status(400).send({
        message: "Please provide customer",
        success: false,
      });
    }

    const orders = await MyOrderModel.find({ user: _id });

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

const getMyOrderDetailsByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).send({
        message: "Order Id is required",
        success: false,
        error: "Required fields are missing",
      });
    }
    const details = await MyOrderModel.findOne(
      {
        "orders._id": orderId,
      },
      { "orders.$": 1 }
    );
    return res.status(200).send({
      message: "Order details",
      success: true,
      details: details.orders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal Server Error",
      success: false,
      error,
    });
  }
};

export { myOrders, getMyOrderDetailsByOrderId };
