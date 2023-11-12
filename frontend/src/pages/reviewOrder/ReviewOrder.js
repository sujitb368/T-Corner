import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../../context/cartContext";
import { Col, Container, Row } from "react-bootstrap";
import axios from "axios";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Message from "../../components/message/Message";

function ReviewOrder() {
  const { cartState, cartDispatch } = useCart();

  let isQuantityAvailable = true;

  //eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();
  const payment = searchParams.get("payment");
  //get the address from url
  const address = JSON.parse(searchParams.get("address"));

  //get token from context
  const token = cartState.token;
  //get user from context
  const user = cartState.user;

  //navigate

  const navigate = useNavigate();

  const checkProductQuantities = async () => {
    try {
      const promisesOfQuantityCount = cartState.cartItems.map(async (item) => {
        try {
          const { data } = await axios.post(`/product/quantity`, {
            productId: item.productId,
            quantity: item.quantity * 1,
          });

          if (data.quantity < item.quantity) {
            console.log("quantity: " + item.quantity);
            console.log("data . quantity: " + data.quantity);
            isQuantityAvailable = false;
            Message({
              type: "error",
              message: `${item.name} is not available`,
            });
          }
        } catch (error) {
          Message({
            type: "error",
            message:
              error?.response?.data?.message ??
              error.message ??
              "Can't check quantity of exist",
          });
          console.error(
            `Error checking quantity for product ${item.productId}:`,
            error
          );
        }
      });

      await Promise.all(promisesOfQuantityCount);
    } catch (error) {
      Message({ type: "error", message: error });
      console.error("Error checking product quantities:", error);
    }
  };

  //function to handle placing order
  const placeOrder = async (paymentDetails) => {
    try {
      //checking quantity exist before placing order
      await checkProductQuantities();

      //stop execution if quantity not exist
      if (isQuantityAvailable === false) {
        console.log("isQuantityAvailable", isQuantityAvailable);
        return;
      }

      //call api to place order in backend
      const response = await axios.post(
        `/orders/order`,
        {
          cartItems: cartState.cartItems,
          paymentMethod: paymentDetails?.paymentSource
            ? paymentDetails.paymentSource
            : "COD",
          shippingAddress: cartState.shippingAddress,
          orderStatus: "pending",
          shippingCharge: 100,
          paymentDetails: paymentDetails,
        },
        {
          headers: {
            Authorization: cartState.token,
            "Content-Type": "application/json",
          },
        }
      );
      //after getting success response
      if (response.data.success) {
        //remove the cart from the local storage
        localStorage.removeItem("cart");

        //update context with action type "CLEAR_CART" and payload is empty []
        //in context state cartItem will be a empty array []
        cartDispatch({ type: "CLEAR_CART", payload: [] });

        //call another API to empty the cart in database of this user
        const response = await axios.post(
          `/cart/deleteFromCart`,
          { userId: user._id, cartItems: [] },
          { Authorization: token }
        );

        if (response.data.success) {
          navigate("/user/myorders");
        }
      }
    } catch (error) {
      Message({ type: "error", message: error.response.data.message });

      if (
        error?.response?.data?.message.toLowerCase() === "jwt expired" ||
        error?.response?.data?.message.toLowerCase() === "unauthorized user"
      ) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }

      console.log(error);
    }
  };

  //function to initialize order when using paypal as payment method
  const createOrder = async () => {
    try {
      const response = await axios.post(
        "/orders",

        { cartItems: cartState.cartItems, shippingCharge: 100 },

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const order = response.data;

      if (order.id) {
        return order.id;
      } else {
        const errorDetail = order?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${order.debug_id})`
          : JSON.stringify(order);

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error(error);
      // Handle the error or throw it further if needed
      // throw error;
      Message({ type: "error", message: error.response.data.message });
    }
  };

  //paypal function to capture the order when approve the payment
  const onApprove = async (data) => {
    try {
      const response = await axios.post(
        `/orders/${data.orderID}/capture`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const paymentDetails = {};
      paymentDetails.orderID = data.orderID;
      paymentDetails.payerID = data.payerID;
      paymentDetails.paymentID = data.paymentID;
      paymentDetails.paymentSource = data.paymentSource;
      paymentDetails.status = response.data.status;
      // console.log("inside first", paymentDetails);
      placeOrder(paymentDetails);
      // const orderData = await response.json();
      // const name = orderData.payer.name.given_name;
      // alert(`Transaction completed by ${name}`);
    } catch (error) {
      console.error(error);
      // Handle the error or throw it further if needed
      // throw error;
      Message({ type: "error", message: error.response.data.message });
    }
  };

  return (
    <Container className="p-3 mt-5">
      <Row className="justify-content-center justify-content-md-start">
        <Col xs={10} md={4}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Shipping & Payment Details</div>
            </div>
            <div className="card-body">
              <div className="border p-1">
                <span className="btn p-2 text-decoration-underline rounded fw-bold">
                  Shipping Address:{" "}
                </span>

                <p className="bg-3 text-2 border p-1 rounded">
                  <span>
                    {address.name}, {address.address}, {address.phone},{" "}
                    {address.pin}
                  </span>
                </p>
              </div>
              <div className="border p-1 pb-3 mt-3">
                <span className="btn p-2 text-decoration-underline rounded fw-bold">
                  Payment Method:{" "}
                </span>{" "}
                <br />
                <span className="bg-3 p-2 mt-3 text-2 rounded">{payment}</span>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={10} md={8}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">My Cart's Details</div>
            </div>
            <div className="card-body">
              {cartState.cartItems &&
                cartState.cartItems?.map((item, index) => {
                  return (
                    <Row
                      className={`my-2  ${
                        index !== cartState.cartItems.length - 1
                          ? "border-bottom pb-2"
                          : ""
                      }`}
                      key={item.productId}
                    >
                      <Col xs={12}>
                        <Row className="p-2 border rounded">
                          <Col>
                            <p className="m-0 fw-bold">{item.name}</p>
                            <p className="m-0 fw-bold d-flex justify-content-between">
                              <span>
                                {item.price} * {item.quantity}
                              </span>
                              <span className="ms-5 rupee">
                                &#8377; {item.price * item.quantity}
                              </span>
                            </p>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  );
                })}
            </div>

            {payment === "COD" && (
              <div className="d-flex justify-content-end my-2">
                <button
                  onClick={() => {
                    placeOrder({});
                  }}
                  className="btn bg-3 text-2"
                  style={{ width: "200px" }}
                >
                  Buy Now
                </button>
              </div>
            )}
            {payment === "PAYPAL" && (
              <>
                <div className="d-flex justify-content-end my-2">
                  <div style={{ width: "200px" }} className="col-4 mt-2">
                    <PayPalScriptProvider
                      options={{
                        components: "buttons",
                        clientId:
                          "ATKqVc_5gHMvIsk2YVqo3xemVQZQnUDfIenieg58asdX9WywC_iS-we3xqSeMTAHF0NFmP4WNveJKcp3",
                      }}
                    >
                      <PayPalButtons
                        disabled={false}
                        forceReRender={[{ layout: "horizontal" }]}
                        //   fundingSource="card"
                        createOrder={createOrder}
                        onApprove={onApprove}
                        style={{ layout: "horizontal", label: "buynow" }}
                      />
                    </PayPalScriptProvider>
                  </div>
                </div>
              </>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

// Custom component to wrap the PayPalButtons and show loading spinner

export default ReviewOrder;
