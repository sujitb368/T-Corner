import axios from "axios";
import React, { useEffect, useState } from "react";
import Message from "../../components/message/Message";
import { Col, Container, Row } from "react-bootstrap";
import Sidebar from "../component/sidebar/Sidebar";
import { BsXSquareFill } from "react-icons/bs";
import { useCart } from "../../context/cartContext";
import { Link, useNavigate } from "react-router-dom";

const Orders = ({ allOrders }) => {
  const { cartState, cartDispatch } = useCart();
  const [toggleSideBar, setToggleSideBar] = useState(false);

  // const [orderType, setOrderType] = useState("Pending");

  const [orders, setOrders] = useState([]);

  // get product from
  const [productFrom, setProductFrom] = useState("all");

  //total number of page for pagination
  const [totalPages, setTotalPages] = useState(5);

  //page for search results
  const [page, setPage] = useState(1);

  // const [newStatus, setNewStatus] = useState("");

  const navigate = useNavigate();

  const handelSideBar = () => {
    setToggleSideBar(!toggleSideBar);
  };

  // Function to fetch all orders
  const getOrders = async (currentPage) => {
    try {
      const { data } = await axios.get(
        `/orders/get-orders?page=${currentPage}`,
        {
          headers: {
            Authorization: cartState.token,
          },
        }
      );
      if (data?.success) {
        setOrders(data.orders);
        setTotalPages(data.totalPage);
        setPage(data.currentPage);
        if (!data.orders.length) {
          setProductFrom("");
          cartDispatch({ type: "SEARCH", payload: "" });
        }
      }
    } catch (error) {
      console.log(error);
      Message({
        type: "error",
        message:
          error?.response?.data?.message ??
          "An error occurred while fetching orders:",
      });
      if (
        error?.response?.data?.message?.toLowerCase() === "unauthorized user" ||
        error?.response?.data?.message?.toLowerCase() === "jwt expired"
      ) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  // Function to fetch all orders
  const getSearchedOrders = async (currentPage) => {
    try {
      const { data } = await axios.get(
        `/orders/search-orders?query=${cartState.searchQuery}&page=${currentPage}`,
        {
          headers: {
            Authorization: cartState.token,
          },
        }
      );
      if (data?.success) {
        setOrders(data.orders);
        // setTotalPages(data.totalPage);
        // setPage(data.currentPage);
        if (!data.orders.length) {
          setProductFrom("");
          cartDispatch({ type: "SEARCH", payload: "" });
        }
      }
      Message({
        type: "success",
        message: data.message,
      });
    } catch (error) {
      console.log("error", error);
      Message({
        type: "error",
        message:
          error?.message?.response?.message ??
          "An error occurred while fetching orders:",
      });
    }
  };

  const handelNewStatus = async (value, orderId) => {
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

  const handlePageChange = (currentPage) => {
    if (productFrom === "search") {
      getSearchedOrders(currentPage);
    } else {
      getOrders(currentPage);
    }
  };

  const handelNextPrevious = async (currentPage) => {
    if (productFrom === "search") {
      getSearchedOrders(currentPage);
    } else {
      getOrders(currentPage);
    }
  };

  useEffect(() => {
    getOrders();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (cartState.searchQuery !== "all") {
      getSearchedOrders();
    }
    if (cartState.searchQuery === "all") {
      getOrders();
    }
    //eslint-disable-next-line
  }, [cartState.searchQuery]);

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
          {!orders.length && (
            <p className="text-danger fw-1 fs-2 text-center">
              No more Orders...
            </p>
          )}
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
                              <option
                                selected={!order.orderStatus.length}
                                disabled
                                value="select"
                              >
                                Select
                              </option>
                              <option
                                selected={
                                  order.orderStatus.toLowerCase() ===
                                  "processing"
                                }
                                value="processing"
                              >
                                Processing
                              </option>
                              <option
                                selected={
                                  order.orderStatus.toLowerCase() === "canceled"
                                }
                                value="canceled"
                              >
                                Canceled
                              </option>
                              <option
                                selected={
                                  order.orderStatus.toLowerCase() === "shipped"
                                }
                                value="shipped"
                              >
                                Shipped
                              </option>
                              <option
                                selected={
                                  order.orderStatus.toLowerCase() ===
                                  "delivered"
                                }
                                value="delivered"
                              >
                                Delivered
                              </option>
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

          {/* pagination */}
          <div className="mt-3 pt-3 d-flex justify-content-center aligns-item-center">
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                <li className="page-item">
                  <Link
                    className="page-link text-1"
                    aria-label="Previous"
                    onClick={() => {
                      setPage((page) => {
                        if (page > 1) {
                          handelNextPrevious(page - 1);
                          return page - 1; // Corrected to return the updated value
                        } else {
                          return page; // If page is already 1, return the same value
                        }
                      });
                    }}
                  >
                    <span aria-hidden="true">&laquo;</span>
                    {/* <span className="sr-only">Previous</span> */}
                  </Link>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i} className="page-item">
                    <Link
                      className={`page-link text-1 ${
                        i + 1 <= page - 3 || i + 1 >= page + 3 ? "d-none" : ""
                      } 
                           
                          ${i + 1 === page ? "bg-3 text-1" : ""} `}
                      onClick={() => {
                        setPage(i + 1);
                        handlePageChange(i + 1);
                      }}
                    >
                      {i + 1}
                    </Link>
                  </li>
                ))}

                <Link
                  className="page-link text-1"
                  aria-label="Next"
                  onClick={() => {
                    setPage((page) => {
                      if (page < totalPages) {
                        handelNextPrevious(page + 1);
                        return page + 1; // Corrected to return the updated value
                      } else {
                        return page; // If page is already 1, return the same value
                      }
                    });
                  }}
                >
                  {/* <span className="sr-only">Next</span> */}
                  <span aria-hidden="true">&raquo;</span>
                </Link>
              </ul>
            </nav>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Orders;
