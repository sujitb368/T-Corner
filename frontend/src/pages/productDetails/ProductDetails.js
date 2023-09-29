import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Rating from "../../components/rating/Rating";
import Swal from "sweetalert2";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ProductDetails.css";
import { BsFillCartPlusFill, BsGeoAltFill } from "react-icons/bs";
import { useCart } from "../../context/cartContext";
import Sidebar from "../../admin/component/sidebar/Sidebar";

function ProductDetails() {
  // const [ProductDetail, setProductDetail] = useState();
  const [details, setDetails] = useState([]);
  const { productId } = useParams();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity] = useState(1);

  const loggedInUsers = JSON.parse(localStorage.getItem("user"));

  const userId = loggedInUsers?._id || "";

  const { cartState, cartDispatch } = useCart();

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
      Swal.fire({
        text: "something went wrong",
      });
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
        Swal.fire({
          title: "product already in cart ",
          timer: 2000,
          timerProgressBar: true,
          backdrop: false,
          toast: true,
          position: "top-end",
        });

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

      if (localCart && localCart.length > 0) {
        //if local cart exist then loop through it and modify if needed
        let isProductExist = false;
        localCart.forEach((item) => {
          if (item.productId === productDetails.productId) {
            item.quantity += productDetails.quantity;
            isProductExist = true;
          }
        });
        if (!isProductExist) {
          localCart.push(productDetails);
        }
      } else {
        //push product details to localCart array then store it to localStorage
        //if localCart dont have any items
        localCart.push(productDetails);
      }
      addItemToCart(productDetails);

      localStorage.setItem("cart", JSON.stringify(localCart));

      const response = await axios.post(`/cart/addToCart/${userId}`, {
        userId,
        cartItems: localCart,
      });

      if (response) {
        Swal.fire({
          title: response.data.message,
          timer: 1000,
          timerProgressBar: true,
          backdrop: false,
          toast: true,
          position: "top-end",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
    console.log("cartState in product detail", cartState);
    // eslint-disable-next-line
  }, [productId]);
  return (
    <>
      <Container fluid>
        <Row>
          <Col xs={2} className={`side-bar pt-5 side-bar-responsive bg-2`}>
            {cartState.user.isAdmin ? <Sidebar /> : "user sidebar"}
          </Col>
          <Col className="pt-3 px-3" xs={10}>
            <Row className="border flex-column flex-md-row">
              <Col className="p-3 border-end">
                <img
                  src="https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
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
                  <Button className="bg-2 text-white mt-2 col-8">
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
