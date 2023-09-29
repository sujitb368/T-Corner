import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./MyOrders.css";
import Rating from "../../components/rating/Rating";
import axios from "axios";
import { useCart } from "../../context/cartContext";
function MyOrders() {
  const { cartState, cartDispatch } = useCart();

  // const [orderStatus, setOrderStatus] = useState();

  const [myOrders, setMyOrders] = useState([]);

  const order = {
    orderId: "12345", // Unique identifier for the order
    date: "2023-09-16", // Date of purchase
    items: [
      {
        id: "1", // Unique identifier for the item
        name: "Product 1",
        quantity: 2,
        price: 25.99,
      },
      {
        id: "2",
        name: "Product 2",
        quantity: 1,
        price: 19.99,
      },
      // Add more items as needed
    ],
    shippingAddress: {
      street: "123 Main St",
      city: "Example City",
      postalCode: "12345",
      country: "Example Country",
    },
    paymentMethod: "Credit Card",
    status: "Processing", // Order status (e.g., Processing, Shipped, Delivered)
  };

  const getMyOrders = async () => {
    try {
      const response = await axios.post(
        `/myorders/orders`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + cartState.token,
          },
        }
      );

      if (response.data.success) {
        setMyOrders(response.data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (cartState.token) {
      getMyOrders();
    }
    //eslint-disable-next-line
  }, [cartState.token]);

  const handleCancel = () => {
    try {
      console.log("Cancelled");
    } catch (error) {}
  };
  return (
    <Container className="pt-3">
      <Row className="justify-content-center p-1">
        {/* On larger screens, show two boxes */}
        {myOrders &&
          myOrders.map((order) => {
            return (
              <Col key={order._id} md={6} xs={12}>
                <div className="shadow row p-2 me-1 mb-4 rounded">
                  <div className="col-3">
                    <img
                      className="w-100"
                      src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
                      alt="Product"
                      style={{
                        height: "150px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <div className="col-6">
                    <p className="m-0 mb-1 deliver-date">
                      Order on{" "}
                      {new Date("2023-09-14T15:54:14.559Z").getDate() +
                        " " +
                        new Date("2023-09-14T15:54:14.559Z").toLocaleString(
                          "default",
                          {
                            month: "short",
                          }
                        ) +
                        " " +
                        new Date("2023-09-14T15:54:14.559Z").getFullYear()}
                    </p>
                    <p className="m-0 mb-1 product-name text-muted">
                      {order.orderItems[0].name}
                    </p>

                    <p className="m-0 mb-1 status">
                      Status:
                      {order.orderStatus.toLowerCase() === "pending"
                        ? "Processing"
                        : order.orderStatus}
                    </p>
                    {order.orderStatus.toLowerCase() === "delivered" ||
                      (order.orderStatus.toLowerCase() === "completed" && (
                        <div className="rating">
                          {/* You can insert your rating component here */}
                          <Rating giveStar={true} />
                        </div>
                      ))}
                  </div>
                  <div className="col-3 pt-1 text-center">
                    <button className="btn bg-3" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                </div>
              </Col>
            );
          })}

        <Col lg={6} md={12}>
          <div>
            <h1>Order Details</h1>
            <p>Order ID: {order.orderId}</p>
            <p>Date of Purchase:{order.date}</p>

            <h2>Ordered Items</h2>
            {/* <ul>
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.name} (Quantity: {item.quantity})
                  <span>${item.price * item.quantity}</span>
                </li>
              ))}
            </ul> */}

            <p>
              Shipping Address:{" "}
              {order.shippingAddress.street +
                " " +
                order.shippingAddress.city +
                " " +
                order.shippingAddress.postalCode}
            </p>
            <p>Payment Method: {order.paymentMethod}</p>
            <p>Order Status: {order.status}</p>
            {/* <p>Total Amount: ${order.totalAmount}</p> */}

            <div>{/* Add buttons or links for user actions */}</div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default MyOrders;
