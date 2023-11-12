import MyOrderModel from "../models/myOrderModel.js";
import OrderModel from "../models/orderModel.js";

import fetch from "node-fetch";

import moment from "moment-timezone";
import ProductModel from "../models/productModel.js";

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

const placeOrderController = async (req, res) => {
  try {
    const customer = req.user.id;
    const date = new Date();
    const orderDate = moment.utc(date).tz("Asia/Kolkata");
    const {
      cartItems: orderItems,
      orderStatus,
      paymentMethod,
      shippingAddress,
      shippingCharge,
      paymentDetails,
    } = req.body;

    const order = new OrderModel({
      customer,
      orderItems,
      orderStatus,
      paymentMethod,
      shippingAddress,
      shippingCharge,
      paymentDetails,
      orderDate: orderDate,
    });

    await order.save();

    //updating the quantity in product model for each product
    const updateQuantity = orderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { quantity: -item.quantity } },
      },
    }));

    // update product quantity by subtracting ordered quantity from product quantity
    // bulkWrite
    await ProductModel.bulkWrite(updateQuantity);

    // Update the user's myOrder record
    const myOrder = await MyOrderModel.findOne({ user: customer });

    if (myOrder) {
      // Add the new order to the user's myOrder record
      myOrder.orders.push({
        orderItems,
        orderStatus,
        paymentMethod,
        shippingAddress,
        shippingCharge,
        paymentDetails,
        orderDate: orderDate,
      });

      await myOrder.save();
      console.log(444);
    } else {
      // If the user's myOrder record doesn't exist, create a new one
      // Add the new order to the user's myOrder record

      const myOrder = [
        {
          orderItems: orderItems,
          orderStatus: orderStatus,
          paymentMethod: paymentMethod,
          shippingAddress: shippingAddress,
          shippingAddress: shippingAddress,
          shippingCharge: shippingCharge,
          paymentDetails: paymentDetails,
          orderDate: orderDate,
        },
      ];
      const newMyOrder = new MyOrderModel({
        user: customer,
        orders: myOrder,
      });
      await newMyOrder.save();
    }

    return res.status(200).send({
      message: "Order created successfully",
      success: true,
      order,
    });
  } catch (error) {
    console.log("error while creating order", error);
    return res
      .status(500)
      .send({ message: "Unable to place order", success: false, error });
  }
};

//paypal code
/**
 * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
 * @see https://developer.paypal.com/api/rest/authentication/
 */
const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

const createOrder = async (cart) => {
  let total = 0;
  cart?.cartItems?.map((item) => {
    total += item.quantity * item.price;
  });

  total += cart?.shippingCharge;

  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: total,
        },
      },
    ],
  };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
      // "PayPal-Mock-Response":
      //   '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}',
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleResponse(response, cart?.cartItems);
};

const captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
  });

  return handleResponse(response);
};

async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

//function get order details using order id
const getOrderDetailsByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).send({
        message: "Order Id is required",
        success: false,
        error: "Required fields are missing",
      });
    }
    const details = await OrderModel.findOne({ _id: orderId });

    return res.status(200).send({
      message: "Order details",
      success: true,
      details,
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

//function to get all orders
const getOrders = async (req, res) => {
  try {
    const { page = 1, perPage = 10 } = req.query;

    // change to integer
    const pageNumber = parseInt(page) || 1;

    // skip value for pagination
    const skip = (page - 1) * perPage;

    // Find all orders from the Order model

    const orders = await OrderModel.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .populate("customer");

    const totalOrders = await OrderModel.find({}).count();

    // Send the orders as a JSON response
    return res.status(200).send({
      message: "Orders list",
      success: true,
      orders,
      totalPage: Math.ceil(totalOrders / perPage),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res
      .status(500)
      .send({ message: "Failed to fetch orders", success: false, error });
  }
};

const getSearchedOrders = async (req, res) => {
  try {
    // Get search query, page, and perPage from the request
    const { query, page = 1, perPage = 10 } = req.query;

    // Use a regular expression to perform a case-insensitive search on product names and descriptions
    const regex = new RegExp(query, "i");

    // change to integer
    const pageNumber = parseInt(page) || 1;

    // skip value for pagination
    const skip = (page - 1) * perPage;

    // Find all orders from the Order model
    const orders = await OrderModel.find({
      $or: [{ orderStatus: { $regex: regex } }],
    })
      .populate("customer")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage);

    const totalOrders = await OrderModel.find({
      $or: [{ orderStatus: { $regex: regex } }],
    }).count();

    // Send the orders as a JSON response
    return res.status(200).send({
      message: "Orders list",
      success: true,
      orders,
      totalPage: Math.ceil(totalOrders / perPage),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch orders", success: false, error });
  }
};

//function to change status of order
const changeOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    console.log(orderStatus, orderId);

    // Find all orders from the Order model
    const order = await OrderModel.findOneAndUpdate(
      { _id: orderId },
      { $set: { orderStatus } },
      { new: true }
    );

    // Send the orders as a JSON response
    return res
      .status(200)
      .send({ message: "Status Updated", success: true, order });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      message: "Failed to update order Status",
      success: false,
      error,
    });
  }
};

//function to get new order
const getNewOrders = async (req, res) => {
  try {
    //shipped to be in lower case
    const orders = await OrderModel.find({ orderStatus: "pending" });

    // Send the orders as a JSON response
    return res.status(200).send({
      message: "New Orders",
      success: true,
      orders: orders.length,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res
      .status(500)
      .send({ message: "Failed to fetch new orders", success: false, error });
  }
};

//function to get shipped order
const getShippedOrders = async (req, res) => {
  try {
    //shipped to be in lower case
    const orders = await OrderModel.find({ orderStatus: "shipped" });

    // Send the orders as a JSON response
    return res.status(200).send({
      message: "Shipped Orders",
      success: true,
      orders: orders.length,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res
      .status(500)
      .send({ message: "Failed to fetch new orders", success: false, error });
  }
};

export {
  placeOrderController,
  createOrder,
  captureOrder,
  getOrderDetailsByOrderId,
  getOrders,
  changeOrderStatus,
  getSearchedOrders,
  getNewOrders,
  getShippedOrders,
};
