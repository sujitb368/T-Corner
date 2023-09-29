import React from "react";
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
function Header() {
  //get cart state from context
  const { cartState, cartDispatch } = useCart();

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
                  <NavDropdown.Item to="/myorders">Category0</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">
                    Category 1
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">
                    Category 2
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">
                    Category 3
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              {!cartState.user.isAdmin ? (
                <>
                  <Nav.Link as={NavLink} className="text" to="/login">
                    Login
                  </Nav.Link>
                  <Nav.Link as={NavLink} className="text" to="/signup">
                    Sign up
                  </Nav.Link>
                  <Nav.Link as={NavLink} className="text" to="/user/cart">
                    Cart
                  </Nav.Link>
                </>
              ) : (
                ""
              )}
              <NavDropdown
                title={cartState.user.name ?? "Profile"}
                id="user-drop-down"
              >
                <NavDropdown.Item
                  as={Link}
                  to={
                    !cartState.user.isAdmin ? "/user/profile" : "/admin/profile"
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
            </Nav>
          </Col>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
