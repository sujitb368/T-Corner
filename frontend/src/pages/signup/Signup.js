import React, { useState } from "react";
import { Button, Card, Col, Container, Form } from "react-bootstrap";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Swal from "sweetalert2";
import Message from "../../components/message/Message";
function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loding, setLoding] = useState("");

  const navigate = useNavigate();

  const handelSignup = async (e) => {
    e.preventDefault();
    try {
      setLoding(true);
      const response = await axios.post(
        `/user/signup`,
        { name, email, password, confirmPassword, phone },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoding(false);

      if (response.data.success) {
        Message({ type: "success", message: response.data.message });
        navigate("/login");
      } else {
        Swal.fire(response.data.message);
      }
    } catch (error) {
      console.log("Error while signing up", error);
      Message({ type: "success", message: error.response.data.message });
    }
  };
  return (
    <>
      <Container fluid className="pt-5 vh-100">
        <Card className="login-form m-auto px-2" style={{ width: "25rem" }}>
          <Card.Body>
            <div className="text-center mb-1">
              <Card.Title>Signup</Card.Title>
              <p>Enter Your details and Submit</p>
            </div>
            <Form className="">
              <Form.Group className="mb-3">
                <Form.Control
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  type="text"
                  placeholder="Enter your name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  type="email"
                  placeholder="Enter Email"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                  type="tel"
                  placeholder="Enter phone number"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type="password"
                  placeholder="Enter password"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                  type="text"
                  placeholder="Confirm password"
                />
              </Form.Group>
              <Button className="bg-1 w-100 text-3" onClick={handelSignup}>
                Signup
              </Button>
              <div className="d-flex justify-content-center align-items-center my-2">
                <span className="d-inline-block h-line"></span>
                <span className="d-inline-block mx-1">Or Signup with</span>
                <span className="d-inline-block h-line"></span>
              </div>

              <div className="d-flex justify-content-center">
                <Col className="w-100 me-2">
                  <button className="btn bg-1 text-3 me-1 w-100">Google</button>
                </Col>
                <Col>
                  <button className="btn bg-1 text-3 w-100">Facebook</button>
                </Col>
              </div>
              <p className="text-center mt-2">
                Already have an account?{" "}
                <span style={{ cursor: "pointer" }} className="ms-1 text-2">
                  Login
                </span>
              </p>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default Signup;
