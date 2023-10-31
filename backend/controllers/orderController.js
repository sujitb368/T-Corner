import MyOrderModel from "../models/myOrderModel.js";
import OrderModel from "../models/orderModel.js";

import fetch from "node-fetch";

import moment from "moment-timezone";

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
    console.log(orderDate);
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
      console.log("else block");
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

export {
  placeOrderController,
  createOrder,
  captureOrder,
  getOrderDetailsByOrderId,
};
