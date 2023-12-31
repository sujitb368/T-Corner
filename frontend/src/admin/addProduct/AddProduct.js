import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import "./AddProduct.css";
import axios from "axios";

import Sidebar from "../component/sidebar/Sidebar";
import { useCart } from "../../context/cartContext";

import Message from "../../components/message/Message.js";
import { BsXSquareFill } from "react-icons/bs";
function AddProduct() {
  //eslint-disable-next-line
  const { cartState, cartDispatch } = useCart();

  // State variables for product details
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [shipping, setShipping] = useState("");
  const [quantity, setQuantity] = useState("");
  const [colors, setColors] = useState([]);
  const [size, setSize] = useState("");

  // to set the image preview and the selected file raw data
  const [image, setImage] = useState({ preview: "", data: "" });

  // Category state variable
  const [categories, setCategories] = useState("");

  //for form validation
  const [validated, setValidated] = useState(false);

  // Sidebar toggle state
  const [toggleSideBar, setToggleSideBar] = useState(false);

  // Function to handle colors and size from comma-separated values
  const handelColorAndSize = (value, setState) => {
    // Split the comma-separated values and store them in the 'colors' state
    const valueArray = value.split(",").map((color) => color.trim());
    if (valueArray.length) {
      setState(valueArray);
    }
  };

  // Function to handle sidebar toggle
  const handelSideBar = () => {
    setToggleSideBar(!toggleSideBar);
  };

  // Function to fetch categories
  const getCategories = async () => {
    try {
      const response = await axios.get(`/admin/category/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle file selection
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

  // Function to handle product submission
  const handelProduct = async (e) => {
    e.preventDefault();
    try {
      const form = e.currentTarget;
      if (form.checkValidity() === false) {
        e.stopPropagation();
        setValidated(true);
        return;
      }

      // Create a FormData object to handle file upload
      const formData = new FormData();
      formData.append("file", image.data);

      // Check if an image is selected
      if (!image.data) {
        Message({ type: "error", message: "Image is mandatory for post" });

        return;
      }

      // Upload the image using Axios
      const { data } = await axios.post(`/admin/files/upload`, formData, {
        headers: {
          Authorization: cartState.token,
        },
      });

      const { filename } = data;

      // If the image upload is successful, proceed to add the product
      if (filename) {
        const response = await axios.post(
          `/admin/product/addProduct`,
          {
            name,
            description,
            price,
            category,
            quantity,
            shipping,
            filename,
            colors,
            size,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: cartState.token,
            },
          }
        );
        // Handle the response and display messages
        if (response?.data?.success) {
          Message({ type: "success", message: response.data.message });
          setName("");
          setDescription("");
          setPrice("");
          setCategory("");
          setShipping("");
          setQuantity("");
          setColors("");
          setSize("");
          setImage({ preview: "", data: "" });
        } else {
          Message({ type: "error", message: response.data.message });
        }
      }
    } catch (error) {
      console.log("Error while creating the product", error);
      Message({
        type: "error",
        message:
          error.response?.data?.message ??
          error.message ??
          "Something went wrong",
      });
    }
  };

  // Fetch categories on component mount

  useEffect(() => {
    getCategories();
  }, []);
  return (
    <>
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
            <hr className="my-2" />
            <Card
              className="login-form m-auto px-2"
              style={
                window.innerWidth < 540 ? { width: "100%" } : { width: "30rem" }
              }
            >
              <Card.Body>
                <div className="text-center mb-1">
                  <Card.Title>Add Product</Card.Title>
                  <p>Enter details to Add Product</p>
                </div>
                <Form
                  className="row"
                  noValidate
                  validated={validated}
                  onSubmit={handelProduct}
                >
                  <Form.Group className="mb-3 col-md-6">
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
                  <Form.Group className="mb-3 col-md-6">
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
                  <Form.Group className="mb-3 col-md-6">
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
                  <Form.Group className="mb-3 col-md-6">
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
                  <Form.Group className="mb-3 col-md-6">
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
                  <Form.Group className="mb-3 col-md-6">
                    <Form.Control
                      required
                      value={colors}
                      onChange={(e) => {
                        handelColorAndSize(e.target.value, setColors);
                      }}
                      type="text"
                      placeholder="Use (,) for multiple colors"
                    />
                    <Form.Control.Feedback type="invalid">
                      Colors is required field
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3 col-md-6">
                    <Form.Control
                      required
                      value={size}
                      onChange={(e) => {
                        handelColorAndSize(e.target.value, setSize);
                      }}
                      type="text"
                      placeholder="Use (,) for multiple sizes"
                    />
                    <Form.Control.Feedback type="invalid">
                      size is required field
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3 col-md-6">
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
                  <Form.Group className="mb-3 col-12" controlId="fileUpload">
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
                  {image.preview && (
                    <div className="col-12">
                      <img
                        height={200}
                        style={{ objectFit: "contain" }}
                        src={image.preview}
                        alt="product"
                      />
                    </div>
                  )}
                  <div className="col-12 mt-1">
                    <Button className="bg-1 w-100 text-3" type="submit">
                      Add Product
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default AddProduct;
