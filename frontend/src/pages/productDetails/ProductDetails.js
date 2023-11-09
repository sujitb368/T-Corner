import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Rating from "../../components/rating/Rating";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetails.css";
import { BsFillCartPlusFill, BsGeoAltFill } from "react-icons/bs";
import { useCart } from "../../context/cartContext";
import Message from "../../components/message/Message.js";
import { baseUrl } from "../../constant.js";

function ProductDetails() {
  // const [ProductDetail, setProductDetail] = useState();
  const [details, setDetails] = useState([]);
  const { productId } = useParams();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity] = useState(1);
  const { cartState, cartDispatch } = useCart();

  const loggedInUsers = JSON.parse(localStorage.getItem("user"));

  const userId = loggedInUsers?._id || "";

  const navigate = useNavigate();

  // Functions to add items to the cart
  const addItemToCart = (item) => {
    cartDispatch({ type: "ADD_TO_CART", payload: item });
  };

  const getProduct = async () => {
    try {
      const response = await axios.get(`/product/getProductId/${productId}`);
      response.data.product[0].colors = ["red", "green", "blue"];
      response.data.product[0].sizes = ["x", "xl", "m", "xxl", "s"];

      setDetails(response.data.product[0]);
    } catch (error) {
      Message({ type: "error", message: error.response.data.message });
    }
  };

  const handelAddToCart = async (product) => {
    try {
      //get cart from context
      const localCart = cartState.cartItems || [];

      const isItemExist = cartState.cartItems.filter(
        (cartItem) => cartItem.productId === product._id
      );
      if (isItemExist.length) {
        Message({ type: "error", message: "product already in cart" });
        return;
      }

      //destructure product details
      const {
        sizes,
        colors,
        shipping,
        createdAt,
        updatedAt,
        _id,
        ...productDetails
      } = product;
      productDetails.color = selectedColor;
      productDetails.size = selectedSize;
      productDetails.quantity = quantity;
      productDetails.productId = _id;

      //push product details to localCart array then store it to localStorage
      //if localCart don't have any items
      localCart.push(productDetails);
      addItemToCart(productDetails);

      localStorage.setItem("cart", JSON.stringify(localCart));

      const response = await axios.post(`/cart/addToCart/${userId}`, {
        userId,
        cartItems: localCart,
      });

      if (response) {
        Message({ type: "success", message: response.data.message });
      }
    } catch (error) {
      console.log(error);
      Message({ type: "error", message: error.response.data.message });
    }
  };

  const buyNow = async (product) => {
    try {
      const localCart = cartState.cartItems || [];

      const isItemExist = cartState.cartItems.filter(
        (cartItem) => cartItem.productId === product._id
      );
      if (isItemExist.length) {
        navigate(`${cartState.token ? "/user/cart" : "/cart"}`);
        return;
      }

      //destructure product details
      const {
        sizes,
        colors,
        shipping,
        createdAt,
        updatedAt,
        _id,
        ...productDetails
      } = product;
      productDetails.color = selectedColor;
      productDetails.size = selectedSize;
      productDetails.quantity = quantity;
      productDetails.productId = _id;

      //push product details to localCart array then store it to localStorage
      //if localCart don't have any items
      localCart.push(productDetails);
      addItemToCart(productDetails);

      localStorage.setItem("cart", JSON.stringify(localCart));

      const response = await axios.post(`/cart/addToCart/${userId}`, {
        userId,
        cartItems: localCart,
      });

      if (response) {
        navigate(`${cartState.token ? "/user/cart" : "/cart"}`);
      }
    } catch (error) {
      console.log(error);
      Message({ type: "error", message: error.response.data.message });
    }
  };

  useEffect(() => {
    getProduct();
    // eslint-disable-next-line
  }, [productId]);
  return (
    <>
      <Container fluid>
        <Row>
          <Col xs={2} className={`side-bar pt-5 side-bar-responsive`}></Col>
          <Col className="pt-3 px-3" xs={10}>
            <Row className="border flex-column flex-md-row">
              <Col className="p-3 border-end">
                <img
                  src={`${baseUrl}/files/get-file/${details.image}`}
                  className="rounded d-block img-fluid"
                  style={{ objectFit: "contain" }}
                  alt="product view"
                />
              </Col>
              <Col className="p-2 border-end">
                <p className="fw-bold m-0 text-2">{details?.name}</p>
                <p className="fw-bold m-0  text-2">{details?.price}</p>
                <Rating totalStar={details?.averageRating?.toFixed(1)} />
                <hr className="my-1" />
                <p className="fw-normal mb-1">{details?.description}</p>
                <div className="m-0">
                  <p className="fw-bold m-0">Color</p>
                  {details?.colors?.map((color, index) => {
                    return (
                      <span
                        key={index}
                        style={{ backgroundColor: color }}
                        className={`d-inline-block product-color ${
                          selectedColor === color
                            ? "product-color-selected"
                            : ""
                        } ${index !== details.colors.length - 1 ? "me-1" : ""}`}
                        onClick={() => {
                          setSelectedColor(color);
                          console.log(selectedColor);
                        }}
                      ></span>
                    );
                  })}
                </div>
                <div className="m-0">
                  <p className="fw-bold mb-0">Size</p>
                  {details?.sizes?.map((size, index) => {
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedSize(size);
                        }}
                        className={`d-inline-block product-size mt-1 text-2 px-2 ${
                          selectedSize === size ? "product-size-selected" : ""
                        }  ${index !== details.sizes.length - 1 ? "me-2" : ""}`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </Col>
              <Col className="p-2">
                <div className="mb-2">
                  <label className="form-label">
                    <BsGeoAltFill /> Do we deliver at your location?
                  </label>
                  <div>
                    <Col xs={10}>
                      <form className="position-relative">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter your pin and check"
                        />
                        <button
                          type="button"
                          className="position-absolute top-0 end-0 bottom-0 bg-3 color-2 px-1 py-2 border-0"
                        >
                          Check
                        </button>
                      </form>
                    </Col>
                  </div>
                </div>
                <div>
                  <Button
                    onClick={() => handelAddToCart(details)}
                    className="bg-2 text-white col-8"
                  >
                    <BsFillCartPlusFill /> Add To Cart
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={() => buyNow(details)}
                    className="bg-2 text-white mt-2 col-8"
                  >
                    Buy Now
                  </Button>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ProductDetails;
