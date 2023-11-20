import React, { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Sidebar from "../component/sidebar/Sidebar";
import axios from "axios";
import Message from "../../components/message/Message";
import { BsXSquareFill } from "react-icons/bs";
function AddCategory() {
  //// State for form validation
  const [validated, setValidated] = useState(false);

  // State for sidebar toggle
  const [toggleSideBar, setToggleSideBar] = useState(false);

  // State for category input
  const [category, setCategory] = useState("");

  // Get token from local storage
  const token = localStorage.getItem("token");

  // Function to handle category submission
  const handelCategory = async (e) => {
    e.preventDefault();
    try {
      const form = e.currentTarget;

      // Check if form is valid
      if (form.checkValidity() === false) {
        // console.log(validated);
        e.stopPropagation();
        setValidated(true);
        return;
      }

      // Send a POST request to create a new category
      const response = await axios.post(
        `/admin/category/create-category`,
        { category },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      if (response?.data) {
        Message({ type: "success", message: response.data.message });
        setCategory("");
      }
    } catch (error) {
      console.log(error);
      Message({
        type: "error",
        message:
          error?.response?.data?.message ??
          error?.message ??
          "Something went wrong",
      });
    }
  };

  // Function to handle sidebar toggle
  const handelSideBar = () => {
    setToggleSideBar(!toggleSideBar);
  };
  return (
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
          <hr className="my-3" />

          <Card
            className="login-form m-auto px-2"
            style={
              window.innerWidth < 540 ? { width: "100%" } : { width: "25rem" }
            }
          >
            <Card.Body>
              <div className="text-center mb-1">
                <Card.Title>Add Category</Card.Title>
              </div>
              <Form noValidate validated={validated} onSubmit={handelCategory}>
                <Form.Group className="mb-3">
                  <Form.Control
                    required
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                    }}
                    type="text"
                    placeholder="Enter a category"
                  />
                  <Form.Control.Feedback type="invalid">
                    Category is required field
                  </Form.Control.Feedback>
                </Form.Group>

                <Button className="bg-1 w-100 text-3" type="submit">
                  Add Category
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AddCategory;
