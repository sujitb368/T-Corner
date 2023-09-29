import React, { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Sidebar from "../component/sidebar/Sidebar";
import axios from "axios";
function AddCategory() {
  //for form validation
  const [validated, setValidated] = useState(false);
  const [toggleSideBar, setToggleSideBar] = useState(false);
  const [category, setCategory] = useState("");

  // const token = localStorage.getItem('token')

  const handelCategory = async (e) => {
    e.preventDefault();
    try {
      const form = e.currentTarget;
      if (form.checkValidity() === false) {
        console.log(validated);
        e.stopPropagation();
        setValidated(true);
        return;
      }
      const response = await axios.post(
        `/admin/category/create-category`,
        { category },
        {
          headers: {
            "Content-Type": "application/json",
            // "Authorization": token,
          },
        }
      );
      console.log("category response = ", response);
    } catch (error) {}
  };
  const handelSideBar = () => {
    setToggleSideBar(!toggleSideBar);
  };
  return (
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
