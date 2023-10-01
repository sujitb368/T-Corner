import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import "./AddProduct.css";
import axios from "axios";

import Sidebar from "../component/sidebar/Sidebar";
import { useCart } from "../../context/cartContext";

import Message from "../../components/message/Message.js";
function AddProduct() {
  //eslint-disable-next-line
  const { cartState, cartDispatch } = useCart();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [shipping, setShipping] = useState("");
  const [quantity, setQuantity] = useState("");
  // const [loding, setLoding] = useState("");

  const [image, setImage] = useState({ preview: "", data: "" });

  //category
  const [categories, setCategories] = useState("");
  //for form validation
  const [validated, setValidated] = useState(false);
  const [toggleSideBar, setToggleSideBar] = useState(false);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:3005", // Set your base URL here
  });

  //eslint-disable-next-line
  const handelSideBar = () => {
    setToggleSideBar(!toggleSideBar);
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(`/admin/category/categories`);

      console.log(response);

      setCategories(response.data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileSelect = (event) => {
    try {
      const img = {
        preview: URL.createObjectURL(event.target.files[0]),
        data: event.target.files[0],
      };
      //set the value of state variable `image` with `img` from above object
      setImage(img);
    } catch (error) {
      console.log("error: " + error);
    }
  };

  const handelProduct = async (e) => {
    e.preventDefault();
    try {
      const form = e.currentTarget;
      if (form.checkValidity() === false) {
        console.log(validated);
        e.stopPropagation();
        setValidated(true);
        return;
      }
      // setLoding(true);

      const formData = new FormData();
      formData.append("file", image.data);

      if (!image.data) {
        Message({ type: "error", message: "Image is mandatory for post" });

        return;
      }
      const { data } = await axiosInstance.post(
        `api/v1/admin/files/upload`,
        formData,
        {
          headers: {
            Authorization: cartState.token,
          },
        }
      );
      const { filename } = data;

      console.log("file name: " + filename);

      if (filename) {
        const response = await axios.post(
          `/admin/product/addProduct`,
          { name, description, price, category, quantity, shipping, filename },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // setLoding(false);

        if (response.data.success) {
          Message({ type: "error", message: response.data.message });
        } else {
          Message({ type: "error", message: response.data.message });
        }
      }
    } catch (error) {
      console.log("Error while signing up", error);
      Message({ type: "error", message: error.response?.data?.message });
    }
  };

  useEffect(() => {
    getCategories();
  }, []);
  return (
    <>
      <Container fluid>
        <Row>
          <Col
            xs={2}
            className={`side-bar pt-5 side-bar-responsive bg-2${
              toggleSideBar ? "side-bar-responsive-toggle" : ""
            }`}
          >
            <Sidebar />
          </Col>

          <Col className={`bg-4 pt-4 `} xs={window.innerWidth <= 830 ? 12 : 10}>
            <h4 className="text-2">Dashboard</h4>
            <hr className="my-2" />
            <Card
              className="login-form m-auto px-2"
              style={
                window.innerWidth < 540 ? { width: "100%" } : { width: "25rem" }
              }
            >
              <Card.Body>
                <div className="text-center mb-1">
                  <Card.Title>Add Product</Card.Title>
                  <p>Enter details to Add Product</p>
                </div>
                <Form noValidate validated={validated} onSubmit={handelProduct}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      type="text"
                      placeholder="Enter Product name"
                    />
                    <Form.Control.Feedback type="invalid">
                      Name is required field
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control
                      required
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                      type="text"
                      placeholder="Enter product description"
                    />
                    <Form.Control.Feedback type="invalid">
                      Description is required field
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control
                      required
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value);
                      }}
                      type="text"
                      placeholder="Enter product price"
                    />
                    <Form.Control.Feedback type="invalid">
                      Price is required field
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Select
                      onChange={(e) => setCategory(e.target.value)}
                      value={category}
                      aria-label="Default select example"
                    >
                      <option>Select Category</option>
                      <>
                        {categories &&
                          categories.map((category) => {
                            return (
                              <option key={category._id}>
                                {category.category}
                              </option>
                            );
                          })}
                      </>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Category is required field
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control
                      required
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(e.target.value);
                      }}
                      type="text"
                      placeholder="Enter quantity"
                    />
                    <Form.Control.Feedback type="invalid">
                      Quantity is required field
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Select
                      required
                      value={shipping}
                      onChange={(e) => {
                        setShipping(e.target.value);
                      }}
                    >
                      <option>Are you shipping</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Shipping is required field
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="fileUpload">
                    <input
                      onChange={(e) => handleFileSelect(e)}
                      type="file"
                      placeholder="Choose a file"
                      className="form-control"
                    />
                  </Form.Group>
                  <Form.Control.Feedback type="invalid">
                    Image is required
                  </Form.Control.Feedback>
                  <Button className="bg-1 w-100 text-3" type="submit">
                    Add Product
                  </Button>
                </Form>
                {/* <img src="uploadedFiles\\1695476783822_azan ali.png" /> */}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default AddProduct;
