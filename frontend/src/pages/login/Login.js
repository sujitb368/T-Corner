import React, { useState } from "react";
import { Button, Card, Col, Container, Form } from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./Login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  /* `useState` hook from React to create three state variables: `email`,
  `password`, and `loading`. */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loding, setLoding] = useState("");

  const navigate = useNavigate();

  const handelLogin = async (e) => {
    e.preventDefault();
    /* The code block you provided is handling the login process. Here's a breakdown of what it does: */
    try {
      // show loder
      setLoding(true);

      //API call to login user
      const response = await axios.post(
        `api/v1/user/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      //if login is successful enter inside if block
      if (response.data.success) {
        //show alert with success message
        Swal.fire({
          title: response.data.message,
          timer: 2000,
          timerProgressBar: true,
          backdrop: false,
          toast: true,
          position: "top-end",
        });
        //store the token, user into local storage
        /* The code `localStorage.setItem("token", response.data.token)` is storing the token received
        from the backend API response in the browser's local storage. The token is typically used
        for authentication purposes and is sent with subsequent API requests to verify the user's
        identity. */
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        //close loder
        setLoding(false);

        //after login redirect to all post page
        // navigate("/home");
      } else {
        //if login unsuccessful
        //show alert with the error message
        Swal.fire(response.data.message);
      }
    } catch (error) {
      /* The code block you provided is handling the error that occurs during the login process. */
      console.log("Error while login", error.response);

      //show alert with the error message
      if (error) {
        Swal.fire(error.response.data.message);
        //close loder
        setLoding(false);
      }
    }
  };

  const tooglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Container fluid className="pt-5 vh-100">
        <Card className="login-form m-auto px-2" style={{ width: "20rem" }}>
          <Card.Body>
            <div className="text-center mb-1">
              <Card.Title>Login</Card.Title>
              <p>Enter Your details to login</p>
            </div>
            <Form className="">
              <Form.Group className="mb-3">
                <Form.Control
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  type="email"
                  placeholder="Enter Email/Phone"
                />
              </Form.Group>
              <Form.Group className="mb-3 position-relative">
                <Form.Control
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                />

                <i className="password-toggle-button" onClick={tooglePassword}>
                  {showPassword ? <BsEyeSlash /> : <BsEye />}
                </i>
              </Form.Group>
              <Button
                className="bg-1 w-100 text-3 "
                onClick={(e) => handelLogin(e)}
              >
                Login
              </Button>
              <div className="d-flex justify-content-center align-items-center my-2">
                <span className="d-inline-block h-line"></span>
                <span className="d-inline-block mx-1">Or Sign in with</span>
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
                Don't have an account?{" "}
                <span style={{ cursor: "pointer" }} className="ms-1 text-2">
                  Signup
                </span>
              </p>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default Login;
