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
import { NavLink } from "react-router-dom";
import { useCart } from "../../context/cartContext";
function Header() {
  //get cart state from context
  const { cartState, cartDispatch } = useCart();
  return (
    <Navbar expand="lg" className="bg-body-tertiary bg-1">
      <Container>
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
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
              <Nav.Link as={NavLink} className="text" to="/">
                Home
              </Nav.Link>

              <NavDropdown title="Category" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">
                  Category0
                </NavDropdown.Item>
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
              <Nav.Link as={NavLink} className="text" to="/login">
                Login
              </Nav.Link>
              <Nav.Link as={NavLink} className="text" to="/signup">
                Sign up
              </Nav.Link>
              <Nav.Link as={NavLink} className="text" to="/cart">
                Cart
              </Nav.Link>
              <Nav.Link as={NavLink} className="text" to="">
                {cartState.user.name ?? "Profile"}
              </Nav.Link>
            </Nav>
          </Col>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
