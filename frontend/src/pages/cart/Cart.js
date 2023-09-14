import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { BsHandbag, BsTrash, BsTrash2, BsTrash3Fill } from "react-icons/bs";
import { Link } from "react-router-dom";
import "./Cart.css";
import axios from "axios";
import { useCart } from "../../context/cartContext";
function Cart() {
  //state variables
  //cart items
  const [cart, setCart] = useState([]);
  const [price, setPrice] = useState(0);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [shippingCost, setShippingCost] = useState(100);
  //setCartQuantity
  const [cartQuantity, setCartQuantity] = useState();
  //get cart state from context
  const { cartState, cartDispatch } = useCart();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    setCart(cartState.cartItems);
    setPrice(
      cartState.cartItems.reduce(
        (prePrice, item) => prePrice + item.price * item.quantity,
        0
      )
    );
    setEstimatedPrice(price + (shippingCost ?? 100));
  }, [price, cartState]);

  const deleteCartItem = async (productId) => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart"));
      const newCart = cart.filter((item) => item.productId !== productId);
      const response = await axios.post(
        `/api/v1/cart/deleteFromCart/${productId}`,
        { userId: user._id, cartItems: newCart },
        { Authrization: token }
      );

      if (response.data.success) {
        localStorage.setItem("cart", JSON.stringify(newCart));
        cartDispatch({ type: "DELETE_ITEM", payload: productId });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateQuantity = (type, productId, index) => {
    if (type === "INCREASE_QUANTITY") {
      cartDispatch({ type: "INCREASE_QUANTITY", payload: productId });
      //get cart from local storage
      const cart = JSON.parse(localStorage.getItem("cart"));
      //update quantity
      cart[index].quantity += 1;
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

  return (
    <Container className="pt-5 container-fluid container-md">
      <h1 className="text-center">
        {" "}
        <BsHandbag />
        <span className="mt-1 ms-2 fw-bold">My Cart</span>
      </h1>
      <Row className="flex-column flex-md-row align-items-center px-2 px-md-0">
        <Col className="border shadow rounded me-md-2" xs={12} md={7}>
          {cart &&
            cart.map((item, index) => {
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
                      src="https://images.ctfassets.net/hrltx12pl8hq/3j5RylRv1ZdswxcBaMi0y7/b84fa97296bd2350db6ea194c0dce7db/Music_Icon.jpg"
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
                        <Row className="px-1">
                          <Button
                            onClick={() =>
                              updateQuantity(
                                "DECREASE_QUANTITY",
                                item.productId,
                                index
                              )
                            }
                            className="p-0 bg-2 text-white col-2 increment-btn"
                          >
                            -
                          </Button>
                          <input
                            value={item.quantity}
                            onChange={(e) => setCartQuantity(e.target.value)}
                            className="col-7 increment-input"
                            type="number"
                            min="1"
                            disabled
                          />
                          <Button
                            onClick={() =>
                              updateQuantity(
                                "INCREASE_QUANTITY",
                                item.productId,
                                index
                              )
                            }
                            className="p-0 bg-2 text-white col-2 increment-btn"
                          >
                            +
                          </Button>
                        </Row>
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
              to="/checkout"
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
