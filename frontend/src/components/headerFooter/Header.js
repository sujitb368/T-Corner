import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Nav,
  Navbar,
  NavDropdown,
  Row,
} from "react-bootstrap";
import "./Header.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../context/cartContext";
import axios from "axios";
import Message from "../message/Message";
function Header() {
  //get cart state from context
  const { cartState, cartDispatch } = useCart();
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const handelLogOut = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      cartDispatch({
        type: "LOGIN_FAIL",
      });

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCategories = async (event, id) => {
    try {
      console.log(event, id);
      const { data } = await axios.get(`/category/categories`);
      if (data.success) {
        setCategories(data.categories);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
      Message({
        type: "error",
        message: error.response?.data?.message ?? "Something went wrong",
      });
    }
  };
  useEffect(() => {
    getAllCategories();
  }, []);
  return (
    <Navbar expand="lg" className="bg-body-tertiary bg-1">
      <Container>
        <Navbar.Brand className="text-white" to="/">
          T-Corner
        </Navbar.Brand>
        <Navbar.Toggle className="bg-3" aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Col>
            <Form>
              <Row>
                <Col className="w-75" sm="auto">
                  <Form.Control
                    type="text"
                    placeholder="Search"
                    className=" mr-sm-2"
                  />
                </Col>
                <Col className="mt-1 mt-md-0" sm="auto">
                  <Button className="bg-2" type="submit">
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col>
            <Nav className="d-flex justify-content-end">
              {!cartState.user.isAdmin ? (
                <Nav.Link as={NavLink} className="text" to="/">
                  Home
                </Nav.Link>
              ) : (
                <Nav.Link as={NavLink} className="text" to="/">
                  Pending Orders
                </Nav.Link>
              )}

              {!cartState.user.isAdmin && (
                <NavDropdown title="Category" id="basic-nav-dropdown">
                  <>
                    {categories.map((category) => (
                      <NavDropdown.Item
                        as={Link}
                        key={category._id}
                        to={`/?category=${category.category}`}
                      >
                        {category.category}
                      </NavDropdown.Item>
                    ))}
                  </>
                </NavDropdown>
              )}
              {!cartState.user.isAdmin ? (
                <>
                  {!cartState.token && (
                    <>
                      <Nav.Link as={NavLink} className="text" to="/login">
                        Login
                      </Nav.Link>
                      <Nav.Link as={NavLink} className="text" to="/signup">
                        Sign up
                      </Nav.Link>
                    </>
                  )}
                  <Nav.Link
                    as={NavLink}
                    className="text"
                    to={cartState.token ? "/user/cart" : "/cart"}
                  >
                    Cart
                  </Nav.Link>
                </>
              ) : (
                ""
              )}
              {cartState.token && (
                <NavDropdown
                  title={cartState.user.name ?? "Profile"}
                  id="user-drop-down"
                >
                  <NavDropdown.Item
                    as={Link}
                    to={
                      !cartState.user.isAdmin
                        ? "/user/profile"
                        : "/admin/profile"
                    }
                  >
                    Profile
                  </NavDropdown.Item>

                  {!cartState.user.isAdmin && (
                    <NavDropdown.Item as={Link} to="/user/myorders">
                      My Orders
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Item onClick={handelLogOut}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Col>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
