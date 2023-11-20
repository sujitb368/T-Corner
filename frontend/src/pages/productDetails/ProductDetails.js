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

/**
 * ProductDetails component for displaying detailed information about a product.
 */
function ProductDetails() {
  // state variables
  const { cartState, cartDispatch } = useCart();
  const [details, setDetails] = useState([]);
  const { productId } = useParams();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [locationCheckResult, setLocationCheckResult] = useState("");
  const [quantity] = useState(1);
  const [checkPin, setCheckPin] = useState("");

  const loggedInUsers = JSON.parse(localStorage.getItem("user"));

  const userId = loggedInUsers?._id || "";

  const navigate = useNavigate();

  // Function to fetch available product quantity
  const getQuantity = async (productId, quantity) => {
    try {
      const { data } = await axios.post(`/product/quantity`, {
        productId,
        quantity: quantity * 1,
      });
      if (data) {
        return data.quantity;
      }
    } catch (error) {
      console.log(error);
      Message({ type: "error", message: error.response.data.message });
    }
  };

  // Functions to add items to the cart
  const addItemToCart = (item) => {
    cartDispatch({ type: "ADD_TO_CART", payload: item });
  };

  // Function to fetch product details by productId
  const getProduct = async () => {
    try {
      const response = await axios.get(`/product/getProductId/${productId}`);

      setDetails(response.data.product[0]);
    } catch (error) {
      Message({ type: "error", message: error.response.data.message });
    }
  };

  // Function to handle adding product to the cart
  const handelAddToCart = async (product) => {
    try {
      //get cart from context
      const localCart = cartState.cartItems || [];

      // Check if the item is already in the cart
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

      // Check if the quantity is available
      const isQuantityAvailable = await getQuantity(_id, 1);

      if (isQuantityAvailable < 1) {
        Message({ type: "error", message: "Not available" });
        return;
      }

      //push product details to localCart array then store it to localStorage
      //if localCart don't have any items
      localCart.push(productDetails);
      addItemToCart(productDetails);

      localStorage.setItem("cart", JSON.stringify(localCart));

      // Add item to the cart in the backend
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

  // Function to handle the "Buy Now" button
  const buyNow = async (product) => {
    try {
      const localCart = cartState.cartItems || [];

      // Check if the item is already in the cart
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

  // Function to check delivery at a specific location
  const locationCheck = async () => {
    if (checkPin.length <= 3) {
      Message({
        type: "error",
        message: "Please provide a valid pin of minimum 6 numbers",
      });
    } else {
      setTimeout(() => {
        setLocationCheckResult("Yes we deliver at your location");
      }, 1000);
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
                        }}
                      ></span>
                    );
                  })}
                </div>
                <div className="m-0">
                  <p className="fw-bold mb-0">Size</p>
                  {details?.size?.map((size, index) => {
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedSize(size);
                        }}
                        className={`d-inline-block product-size mt-1 text-2 px-2 ${
                          selectedSize === size ? "product-size-selected" : ""
                        }  ${index !== details.size.length - 1 ? "me-2" : ""}`}
                      >
                        {size.toUpperCase()}
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
                          required
                          min={3}
                          max={6}
                          value={checkPin}
                          onChange={(e) => setCheckPin(e.target.value)}
                        />
                        <button
                          onClick={locationCheck}
                          type="button"
                          className="position-absolute top-0 end-0 bottom-0 bg-3 color-2 px-1 py-2 border-0"
                        >
                          Check
                        </button>
                      </form>
                      <span
                        style={{ fontSize: "14px" }}
                        className="fw-bold text-danger"
                      >
                        {locationCheckResult}
                      </span>
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
