import React, { useEffect, useState } from "react";
import Message from "../../components/message/Message";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/cartContext";
import { Col } from "react-bootstrap";

import "./OrderDetails.css";

function OrderDetails() {
  const { cartState } = useCart();
  const [orderDetails, setOrderDetails] = useState([]);
  let { orderId } = useParams();

  const getOrderDetails = async () => {
    try {
      const { data } = await axios.get(`/myorders/orders/${orderId}`, {
        headers: {
          Authorization: cartState.token,
        },
      });
      console.log("order  details", data.details);

      setOrderDetails(data.details);
      Message({ type: "success", message: data.message });
    } catch (error) {
      Message({ type: "error", message: error.response.message });
    }
  };

  useEffect(() => {
    getOrderDetails();
    //eslint-disable-next-line
  }, [cartState.token]);
  return (
    <>
      <div className="container py-5 ">
        <div className="row rounded shadow p-2">
          <div className="col-md-4">
            {orderDetails &&
              orderDetails[0]?.orderItems?.map((order) => {
                return (
                  <>
                    <Col key={order._id} xs={12}>
                      <div className="shadow row p-2 me-1 mb-4 rounded">
                        <div className="col-3">
                          <img
                            className="w-100"
                            src={`http://localhost:8000/api/v1/files/get-file/${order.image}`}
                            alt="Product"
                            style={{
                              height: "150px",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                        <div className="col-6">
                          <p className="m-0 mb-1 product-name text-muted">
                            {order.name}
                          </p>

                          <p className="m-0 mb-1 status">{order.price}</p>

                          <p className="m-0 mb-1 status">
                            Quantity :{order.quantity}
                          </p>

                          {order.color && (
                            <p className="m-0 mb-1 status">{order.color}</p>
                          )}
                          {order.size && (
                            <p className="m-0 mb-1 status">{order.size}</p>
                          )}
                        </div>
                      </div>
                    </Col>
                  </>
                );
              })}
          </div>
          <div className="col-md-6">
            <p>
              Status :{" "}
              <span className="details-span">
                {orderDetails[0]?.orderStatus}
              </span>
            </p>
            <p>
              Payment Method :{" "}
              <span className="details-span">
                {orderDetails[0]?.paymentMethod}
              </span>
            </p>
            <p>
              Shipping Charge:{" "}
              <span className="details-span">
                {orderDetails[0]?.shippingCharge}
              </span>
            </p>
            <div>
              <p>
                Shipping Address :{" "}
                <span className="details-span">
                  {orderDetails[0]?.shippingAddress.name}{" "}
                  {orderDetails[0]?.shippingAddress.address}{" "}
                  {orderDetails[0]?.shippingAddress.landMark}{" "}
                  {orderDetails[0]?.shippingAddress.phone}{" "}
                  {orderDetails[0]?.shippingAddress.pin}{" "}
                </span>
              </p>
              {orderDetails && (
                <p>
                  Order Date :{" "}
                  <span className="details-span">
                    {orderDetails[0]?.orderDate}{" "}
                  </span>
                </p>
              )}
              {orderDetails[0]?.deliveredDate && (
                <p>
                  Delivered :{" "}
                  <span className="details-span">
                    {orderDetails[0]?.deliveredDate}{" "}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetails;
