import axios from "axios";
import React, { useEffect, useState } from "react";
import Message from "../../components/message/Message";
import { Col, Container, Row } from "react-bootstrap";
import Sidebar from "../component/sidebar/Sidebar";
import { BsXSquareFill } from "react-icons/bs";
import { useCart } from "../../context/cartContext";

const Orders = ({ allOrders }) => {
  const { cartState } = useCart();
  const [toggleSideBar, setToggleSideBar] = useState(false);

  // const [orderType, setOrderType] = useState("Pending");

  const [orders, setOrders] = useState([]);

  // const [newStatus, setNewStatus] = useState("");

  const handelSideBar = () => {
    setToggleSideBar(!toggleSideBar);
  };

  // Function to fetch all orders
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/orders/get-orders");
      if (data?.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      Message({
        type: "error",
        message:
          error?.message?.response?.message ??
          "An error occurred while fetching orders:",
      });
    }
  };

  const handelNewStatus = async (value, orderId) => {
    console.log("onchange", value, orderId);
    try {
      const { data } = await axios.put(
        `/orders/change-status/${orderId}`,
        { orderStatus: value },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: cartState.token,
          },
        }
      );
      if (data?.success) {
        getOrders();
      }
    } catch (error) {
      Message({
        type: "error",
        message:
          error?.message?.response?.message ??
          "An error occurred while fetching orders:",
      });
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col
          xs={8}
          md={2}
          className={`side-bar pt-5 side-bar-responsive bg-2 ${
            toggleSideBar ? "side-bar-responsive-toggle" : ""
          }`}
        >
          <Sidebar />
        </Col>
        <Col className={`bg-4 pt-4 `} xs={window.innerWidth <= 830 ? 12 : 10}>
          <div className="d-md-none d-flex justify-content-end">
            {!toggleSideBar ? (
              <button className="btn bg-3" onClick={handelSideBar}>
                Sidebar
              </button>
            ) : (
              <button className="btn bg-3" onClick={handelSideBar}>
                <BsXSquareFill />
              </button>
            )}
          </div>
          <h4 className="text-2">Dashboard</h4>
          <hr className="my-2" />
          {/* <h6>{orderType} Order List</h6> */}
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Payment Status</th>
                  <th>Status</th>
                  <th>Action</th>
                  <th>Shipping Ads.</th>
                  {/* <th>Order Items</th> */}
                </tr>
              </thead>
              <tbody>
                {orders &&
                  orders?.map((order) => {
                    return (
                      <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{order.customer.name}</td>
                        <td>{order.paymentMethod}</td>
                        <td>{order.orderStatus}</td>
                        {order.orderStatus.toLowerCase() !== "delivered" && (
                          <td>
                            <select
                              className="form-select form-select-sm"
                              onChange={(e) =>
                                handelNewStatus(e.target.value, order._id)
                              }
                            >
                              <option disabled value="select">
                                Select
                              </option>
                              <option value="processing">Processing</option>
                              <option value="cancel">Cancel</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </td>
                        )}
                        <td>
                          {order.shippingAddress.address},{" "}
                          {order.shippingAddress.name},{" "}
                          {order.shippingAddress.phone},{" "}
                          {order.shippingAddress.pin},{" "}
                        </td>
                        {/* <td>{order.orderItems.map((item)=>{
                return (<span>product : {item.name}, price: {item.price}</span>)
              })}</td> */}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Orders;
