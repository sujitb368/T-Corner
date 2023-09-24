import MyOrderModel from "../models/myOrderModel.js";

const myOrders = async (req, res) => {
  try {
    const { _id: customer } = req.user;

    if (!customer) {
      return res.status(400).send({
        message: "Please provide customer",
        success: false,
      });
    }

    const orders = await OrderModel.find({ customer });

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

export { myOrders };
