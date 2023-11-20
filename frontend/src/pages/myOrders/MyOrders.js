import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./MyOrders.css";
import Rating from "../../components/rating/Rating";
import axios from "axios";
import { useCart } from "../../context/cartContext";
import { Link } from "react-router-dom";
import Message from "../../components/message/Message";
import { baseUrl } from "../../constant";

/**
 * MyOrders component for displaying user's order history.
 */
function MyOrders() {
  // eslint-disable-next-line
  const { cartState, cartDispatch } = useCart();

  // const [myRating, setMyRating] = useState('');

  const [myOrders, setMyOrders] = useState([]);

  /**
   * Function to fetch user's order history.
   */
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
        setMyOrders(response.data.orders[0].orders);
      }
    } catch (error) {
      console.log(error);
      Message({
        type: "error",
        message: error?.response?.data?.message ?? "Something went wrong",
      });
    }
  };

  /**
   * Function to handle user's product rating.
   * @param {string} productId - ID of the product being rated.
   * @param {number} myRating - User's rating for the product.
   */
  const handleRating = async (productId, myRating) => {
    try {
      const { data } = await axios.post(
        `/rating/rating`,
        {
          user: cartState.user._id,
          rating: myRating,
          productId: productId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        Message({ type: "success", message: data.message });
      }
    } catch (error) {
      console.log(error);
      Message({
        type: "error",
        message:
          error?.response?.data?.message ??
          error?.message ??
          "Something went wrong",
      });
    }
  };

  useEffect(() => {
    if (cartState.token) {
      getMyOrders();
    }
    //eslint-disable-next-line
  }, [cartState.token]);

  return (
    <Container className="pt-3">
      <Row className="justify-content-center p-1">
        {/* On larger screens, show two boxes */}
        {myOrders &&
          myOrders.map((order) => {
            return (
              <Col key={order._id} md={6} xs={12}>
                <div className="shadow row p-2 me-1 mb-4 rounded">
                  <div className="col-9">
                    {order.orderItems &&
                      order.orderItems?.map((item, index) => {
                        return (
                          <div
                            className="row border-bottom mb-1"
                            key={item._id}
                          >
                            <div className="col-4 border border-bottom-0">
                              <img
                                className="w-100"
                                src={`${baseUrl}/files/get-file/${item.image}`}
                                alt="Product"
                                style={{
                                  height: "150px",
                                  objectFit: "contain",
                                }}
                              />
                            </div>
                            <div className="col-8 border border-bottom-0">
                              <p className="m-0 mb-1 product-name text-muted">
                                {item.name}
                              </p>
                              <div className="rating">
                                <Rating
                                  onClick={(myRating) =>
                                    handleRating(item.productId, myRating)
                                  }
                                  giveStar={true}
                                  myRating={item.myRating}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <div
                    className={`col-3 pt-1 text-center ${
                      window.innerWidth <= 764 ? "p-0 ps-1" : ""
                    }`}
                  >
                    <p className="m-0 mb-1 status">
                      <span className="span d-inline-block w-100">
                        {order.orderStatus[0].toUpperCase() +
                          order.orderStatus.slice(1)}
                      </span>
                    </p>

                    <Link
                      to={`/user/myorders/${order._id}`}
                      className="btn bg-3 mt-2 w-100"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </Col>
            );
          })}
      </Row>
    </Container>
  );
}

export default MyOrders;
