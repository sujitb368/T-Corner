import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { BsHandbag, BsTrash3Fill } from "react-icons/bs";
import { Link } from "react-router-dom";
import "./Cart.css";
import axios from "axios";
import { useCart } from "../../context/cartContext";
import Swal from "sweetalert2";
import Message from "../../components/message/Message.js";
import Loder from "../../components/loder/Loder";
import { baseUrl } from "../../constant.js";
function Cart() {
  //state variables
  //cart items
  //eslint-disable-next-line
  const [cart, stCart] = useState([]);
  const [price, setPrice] = useState(0);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [shippingCost, setShippingCost] = useState(100);
  const [loader, setLoader] = useState(false);
  //setCartQuantity
  //get cart state from context
  const { cartState, cartDispatch } = useCart();

  console.log(cartState.cartItems);

  const token = cartState.token;
  const user = cartState.user;

  useEffect(() => {
    // setCart(cartState.cartItems);
    setPrice(
      cartState.cartItems.reduce(
        (prePrice, item) => prePrice + item.price * item.quantity,
        0
      )
    );
    setEstimatedPrice(price + (shippingCost ?? 100));
    setShippingCost(cartState.cartItems?.shippingCost ?? 100);
    //eslint-disable-next-line
  }, [price, cartState]);

  const deleteCartItem = async (productId) => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart"));
      const newCart = cart.filter((item) => item.productId !== productId);
      const response = await axios.post(
        `/cart/deleteFromCart`,
        { userId: user._id, cartItems: newCart },
        { Authorization: token }
      );

      if (response.data.success) {
        localStorage.setItem("cart", JSON.stringify(newCart));
        cartDispatch({ type: "DELETE_ITEM", payload: productId });
      }
    } catch (error) {
      Swal.fire({
        title: error.response.data,
        timer: 2000,
        timerProgressBar: true,
        backdrop: false,
        toast: true,
        position: "top-end",
      });
      console.log(error);
    }
  };

  const updateQuantity = async (type, productId, index, quantity) => {
    if (type === "INCREASE_QUANTITY") {
      //show loader
      setLoader(true);
      const response = await getQuantity(productId, quantity);
      //hide loader
      setLoader(false);
      if (response.success === false) {
        Message({ type: "not-available", message: response.message });
        return;
      }

      //get cart from local storage
      const cart = JSON.parse(localStorage.getItem("cart"));
      //update quantity
      if (cart[index].quantity < 5) {
        cart[index].quantity += 1;
        cartDispatch({ type: "INCREASE_QUANTITY", payload: productId });
      }
      //store again to local storage
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      cartDispatch({ type: "DECREASE_QUANTITY", payload: productId });
      //get cart from local storage
      const cart = JSON.parse(localStorage.getItem("cart"));
      //update quantity if quantity is greater 1 else keep 1 quantity
      cart[index].quantity > 1
        ? (cart[index].quantity -= 1)
        : (cart[index].quantity = 1);
      //store again to local storage
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  };

  const getQuantity = async (productId, quantity) => {
    try {
      const { data } = await axios.post(`/product/quantity`, {
        productId,
        quantity: quantity * 1,
      });
      return data;
    } catch (error) {
      console.log(error);
      Message({ type: "error", message: error.response.data.message });
    }
  };

  return (
    <Container className="pt-5 container-fluid container-md">
      <h1 className="text-center">
        {" "}
        <BsHandbag />
        <span className="mt-1 ms-2 fw-bold">My Cart</span>
      </h1>
      <Row className="flex-column flex-md-row align-items-center px-2 px-md-0">
        <Col className="border shadow rounded me-md-2" xs={12} md={7}>
          {cartState.cartItems &&
            cartState.cartItems.map((item, index) => {
              return (
                <Row
                  className={`my-2  ${
                    index !== cart.length - 1 ? "border-bottom pb-2" : ""
                  }`}
                  key={item.productId}
                >
                  <Col xs={3}>
                    <img
                      style={{ objectFit: "contain" }}
                      src={`${baseUrl}/files/get-file/${item.image}`}
                      alt="cart-product"
                      className="img-fluid"
                    />
                  </Col>
                  <Col xs={9} md={9}>
                    <Row>
                      <Col xs={8}>
                        <p className="m-0 fw-bold">{item.name}</p>
                        <p className="m-0 fw-bold">{item.price}</p>
                      </Col>

                      <Col className="pt-3" xs={4}>
                        <Row className="px-1" style={{ position: "relative" }}>
                          <Button
                            onClick={() =>
                              updateQuantity(
                                "DECREASE_QUANTITY",
                                item.productId,
                                index,
                                item.quantity - 1
                              )
                            }
                            className="p-0 bg-2 text-white col-2 increment-btn"
                          >
                            -
                          </Button>
                          {loader && (
                            <div
                              className=""
                              style={{
                                position: "absolute",
                                width: "84%",
                                height: "100%",
                                backgroundColor: "rgba(0,0,0,.3)",
                              }}
                            >
                              <div
                                className=""
                                style={{
                                  position: "absolute",
                                  top: "-3px",
                                  left: "44%",
                                }}
                              >
                                <Loder />
                              </div>
                            </div>
                          )}
                          <input
                            value={item.quantity}
                            className="col-7 increment-input"
                            type="number"
                            min="1"
                            max="5"
                            disabled
                          />
                          <Button
                            onClick={() =>
                              updateQuantity(
                                "INCREASE_QUANTITY",
                                item.productId,
                                index,
                                item.quantity + 1
                              )
                            }
                            className="p-0 bg-2 text-white col-2 increment-btn"
                          >
                            +
                          </Button>
                        </Row>
                        {item.quantity >= 5 && (
                          <span
                            className="fw-bold bg-3 text-2 px-1 rounded"
                            style={{ fontSize: "11px" }}
                          >
                            Max 5 quantity allowed
                          </span>
                        )}
                        <Row className="text-center pt-1">
                          <span className="p-0 fw-bold text-3">
                            {" "}
                            Total : {item.price * item.quantity}
                          </span>
                        </Row>
                        <Row className="pt-3">
                          <BsTrash3Fill
                            style={{ cursor: "pointer" }}
                            onClick={() => deleteCartItem(item.productId)}
                            className="text-danger"
                          />
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              );
            })}
        </Col>
        <Col className=" shadow rounded mt-3 mt-md-0 pt-1 " xs={12} md={4}>
          <h1 className="text-center">Cart Summary</h1>
          <hr className="my-1" />
          <p className="m-0 p-1 d-flex justify-content-between">
            <span className="text-2">Price</span>
            <span className="text-3">
              <span className="rupee">&#8377;</span> <span>{price}</span>
            </span>
          </p>
          <p className="m-0 p-1 d-flex justify-content-between">
            <span className="text-2">Shipping Charge:</span>
            <span className="text-3">
              <span className="rupee">&#8377;</span> <span>{shippingCost}</span>
            </span>
          </p>
          <hr className="my-1" />
          <p className="m-0 p-1 d-flex justify-content-between">
            <span className="text-2">Estimated Total:</span>
            <span className="text-3">
              <span className="rupee">&#8377;</span>
              <span>{estimatedPrice}</span>
            </span>
          </p>

          <div className="p-3 d-flex justify-content-center">
            <Link
              className="btn m-auto bg-3 text-decoration-none fw-bold text-2 "
              to="/user/checkout"
            >
              Checkout
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Cart;
