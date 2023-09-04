import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import "./AddProduct.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Swal from "sweetalert2";
import Sidebar from "../component/sidebar/Sidebar";

function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [shipping, setShipping] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loding, setLoding] = useState("");
  //category
  const [categories, setCategories] = useState("");
  //for form validation
  const [validated, setValidated] = useState(false);
  const [toggleSideBar, setToggleSideBar] = useState(false);

  const handelSideBar = () => {
    setToggleSideBar(!toggleSideBar);
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(`/api/v1/admin/category/categories`);

      console.log(response);

      setCategories(response.data.categories);
    } catch (error) {}
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
      setLoding(true);

      const response = await axios.post(
        `/api/v1/product/addProduct`,
        { name, description, price, category, quantity, shipping },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoding(false);

      if (response.data.success) {
        Swal.fire(response.data.message);
      } else {
        Swal.fire(response.data.message);
      }
    } catch (error) {
      console.log("Error while signing up", error);
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
                    <Form.Select aria-label="Default select example">
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
                  <Button className="bg-1 w-100 text-3" type="submit">
                    Add Product
                  </Button>
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
