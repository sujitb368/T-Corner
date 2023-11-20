import React, { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loder from "../../components/loder/Loder";
import Message from "../../components/message/Message";

/**
 * ResetPassword component for resetting user passwords.
 */
function ResetPassword() {
  /**
   * useState to manage the state of email, password, loading indicator, and password visibility.
   */
  //eslint-disable-next-line
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Get token from URL parameters
  const token = useParams();

  // Navigation hook
  const navigate = useNavigate();

  /**
   * Toggle the visibility of the password input.
   */
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Handle the password reset process.
   * @param {Event} e - The form submission event.
   */
  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      // show loader
      setloading(true);

      //API call to login user
      const { data } = await axios.put(
        `/user/reset-password`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token.token,
          },
        }
      );

      //if login is successful enter inside if block
      if (data?.success) {
        Message({ type: "success", message: data.message });

        //close loader
        setloading(false);
        //after login redirect to home page
        navigate("/login");
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

  return (
    <>
      <Container fluid className="pt-5 vh-100">
        <Card className="login-form m-auto px-2" style={{ width: "20rem" }}>
          <Card.Body>
            <div className="text-center mb-1">
              <Card.Title>Reset Password</Card.Title>
              <p>
                {!isForgotPassword
                  ? "Enter Your details to login"
                  : "Enter Email and new Password"}
              </p>
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

                <i className="password-toggle-button" onClick={togglePassword}>
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
                onClick={(e) => resetPassword(e)}
              >
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default ResetPassword;
