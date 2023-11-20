import React, { useState } from "react";
import { Button, Card, Col, Container, Form } from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { useCart } from "../../context/cartContext";
import Loder from "../../components/loder/Loder";
import Message from "../../components/message/Message";
// import { initialUserState, userReducer } from "../../reducer/userReducer.js";

/**
 * Login component to handle user login and password recovery.
 */
function Login() {
  //get cart state from context
  // eslint-disable-next-line
  const { cartState, cartDispatch } = useCart();

  // State variables for managing email, password, loading state, and password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Hooks for navigation and location
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Function to handle the login process.
   * @param {Object} e - The event object.
   */
  const handelLogin = async (e) => {
    e.preventDefault();
    /* The code block you provided is handling the login process. Here's a breakdown of what it does: */
    try {
      // show loader
      setloading(true);

      //API call to login user
      const response = await axios.post(
        `/user/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      //if login is successful enter inside if block
      // update state and perform necessary actions
      if (response?.data?.success) {
        Message({ type: "success", message: response.data.message });

        //store the token, user into local storage
        // token and user received from the backend API response
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        // Perform login logic, and if successful, dispatch the user data
        cartDispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: response.data.user,
            token: response.data.token,
          },
        });
        //close loader
        setloading(false);
        //after login redirect to home page
        navigate(location.state || "/");
      }
    } catch (error) {
      /* The code block you provided is handling the error that occurs during the login process. */
      console.log("Error while login", error.response);

      //show alert with the error message
      Message({
        type: "error",
        message: error?.response?.data?.message ?? "Something went wrong",
      });
      setloading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(true);
  };
  //function to request for email with password reset link
  const forgotPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `/user/forgot-password/${email}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (data?.success) {
        Message({ type: "success", message: data.message });
      }
    } catch (error) {
      console.log("Error in forgot password", error);
      Message({
        type: "error",
        message: error?.response?.data?.message ?? "Something went wrong",
      });
    }
  };

  return (
    <>
      <Container fluid className="pt-5 vh-100">
        <Card className="login-form m-auto px-2" style={{ width: "20rem" }}>
          <Card.Body>
            <div className="text-center mb-1">
              <Card.Title>Login</Card.Title>
              <p>
                {!isForgotPassword
                  ? "Enter Your details to login"
                  : "Enter Your Email"}
              </p>
            </div>
            {!isForgotPassword ? (
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

                  <i
                    className="password-toggle-button"
                    onClick={togglePassword}
                  >
                    {showPassword ? <BsEyeSlash /> : <BsEye />}
                  </i>
                </Form.Group>
                {loading && (
                  <div className="text-center">
                    <Loder />
                  </div>
                )}
                <Button
                  disabled={loading}
                  className="bg-1 w-100 text-3 "
                  onClick={(e) => handelLogin(e)}
                >
                  Login
                </Button>
                <p className="my-0 fs-6 text-center text-primary">
                  Unable to login?{" "}
                  <span
                    className="btn btn rounded pt-0 px-0 text-danger text-decoration-underline"
                    onClick={toggleForgotPassword}
                    // onClick={forgotPassword}
                  >
                    forgot Password
                  </span>
                </p>
                <div className="d-flex justify-content-center align-items-center my-2">
                  <span className="d-inline-block h-line"></span>
                  <span className="d-inline-block mx-1">Or Sign in with</span>
                  <span className="d-inline-block h-line"></span>
                </div>

                <div className="d-flex justify-content-center">
                  <Col className="w-100 me-2">
                    <button
                      disabled={loading}
                      className="btn bg-1 text-3 me-1 w-100"
                    >
                      Google
                    </button>
                  </Col>
                  <Col>
                    <button
                      disabled={loading}
                      className="btn bg-1 text-3 w-100"
                    >
                      Facebook
                    </button>
                  </Col>
                </div>

                <p className="text-center mt-2">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    style={{ cursor: "pointer" }}
                    className="ms-1 text-2"
                  >
                    Signup
                  </Link>
                </p>
              </Form>
            ) : (
              <Form className="">
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

                {loading && (
                  <div className="text-center">
                    <Loder />
                  </div>
                )}
                <Button
                  disabled={loading}
                  className="bg-1 w-100 text-3 "
                  onClick={(e) => forgotPassword(e)}
                >
                  Submit
                </Button>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default Login;
