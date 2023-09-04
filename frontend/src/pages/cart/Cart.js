import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { BsHandbag, BsTrash, BsTrash2, BsTrash3Fill } from "react-icons/bs";
import "./Cart.css";
import axios from "axios";
function Cart() {
  //state variables
  //cart items
  const [cart, setCart] = useState([]);
  //setCartQuantity
  const [cartQuantity, setCartQuantity] = useState();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart"));
    setCart(localCart);
  });
  const deleteCartItem = async (productId) => {
    try {
      const response = await axios.post(
        "/api/v1/product/delete-product",
        { productId },
        { Authrization: token }
      );
    } catch (error) {}
  };
  return (
    <Container className="pt-5 container-fluid container-md">
      <h1 className="text-center">
        {" "}
        <BsHandbag />
        <span className="mt-1 ms-2 fw-bold">My Cart</span>
      </h1>
      <Row className="flex-column flex-md-row align-items-center ">
        <Col className="border shadow rounded me-md-2" xs={12} md={7}>
          {cart &&
            cart.map((item, index) => {
              return (
                <Row>
                  <Col xs={3}>
                    <img
                      style={{ objectFit: "contain" }}
                      src="https://images.ctfassets.net/hrltx12pl8hq/3j5RylRv1ZdswxcBaMi0y7/b84fa97296bd2350db6ea194c0dce7db/Music_Icon.jpg"
                      alt="cart-product"
                      className="img-fluid"
                    />
                  </Col>
                  <Col xs={8}>
                    <Row>
                      <Col xs={8}>
                        <p className="m-0 fw-bold">{item.title}</p>
                        <p className="m-0 fw-bold">{item.price}</p>
                      </Col>

                      <Col xs={4}>
                        <Row className="px-1">
                          <Button className="p-0 bg-2 text-white col-2 increment-btn">
                            -
                          </Button>
                          <input
                            value={item.quantity}
                            onChange={(e) => setCartQuantity(e.target.value)}
                            className="col-7 increment-input"
                            type="number"
                          />
                          <Button className="p-0 bg-2 text-white col-2 increment-btn">
                            +
                          </Button>
                        </Row>
                        <Row>
                          <BsTrash3Fill
                            onClick={deleteCartItem}
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
        <Col className="bg-2 shadow rounded " xs={12} md={4}>
          222
        </Col>
      </Row>
    </Container>
  );
}

export default Cart;
