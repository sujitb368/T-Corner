// Profile
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import { useCart } from "../../context/cartContext";
import "./Profile.css";
import { BsCamera } from "react-icons/bs";
import axios from "axios";
import Message from "../../components/message/Message";

//component function
const Profile = () => {
  //eslint-disable-next-line
  const { cartState, cartDispatch } = useCart();

  // state variable to store user all saved addresss
  const [addresses, setAddresses] = useState();

  //function to get all saved addresses w.r.t user
  const getAddress = async (userId) => {
    try {
      const response = await axios.get(`/shipping/shipping-address/${userId}`);
      if (response.data.success) {
        const addresses = response.data.address;
        // selected address means this is selected by user to deliverd the product

        const shippingAddress = addresses.map((address) => address);

        // set the all saved address
        setAddresses(shippingAddress);
      }
    } catch (error) {
      console.log(error);
      Message({ type: "error", message: error.response.data.message });
    }
  };

  useEffect(() => {
    if (cartState.token && !cartState.user.isAdmin) {
      getAddress(cartState.user._id);
    }
  }, [cartState.token, cartState.user._id, cartState.user.isAdmin]);

  return (
    <Container>
      <Row className="mt-5 mb-5">
        <Col md={6}>
          <Card className="rounded shadow">
            <Card.Header as="h5">
              {cartState.user?.isAdmin ? "Admin Profile" : "User Profile"}
              {/* <span className="float-right">
                <FaEdit /> 
              </span> */}
            </Card.Header>
            <Card.Body>
              <Row>
                <Col
                  className="border-bottom border-md-right border-4 profile-image-container border border-2 rounded-circle"
                  md={4}
                >
                  <>
                    <Image
                      src={cartState.user?.profilePic}
                      roundedCircle
                      fluid
                      alt="Profile"
                      className="profile-image  "
                    />

                    <div className="overlay">
                      <label
                        htmlFor="profileImageInput"
                        className="camera-icon"
                      >
                        <BsCamera />
                      </label>
                    </div>
                  </>
                </Col>
                <Col md={8}>
                  <Card.Title>Name: {cartState.user?.name}</Card.Title>
                  <Card.Text>Email: {cartState.user?.email}</Card.Text>
                  <Card.Text>Phone: {cartState.user?.phone}</Card.Text>
                  {/* Add more user? details here */}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {!cartState.user.isAdmin && (
        <Row className="mb-5">
          <Card className="rounded shadow p-0">
            <Card.Header as="h6">Shipping Address</Card.Header>
            <Card.Body className="p-3">
              <Row>
                {addresses &&
                  addresses.map((address, index) => {
                    return (
                      <Col className="col-md-4 col-6 mb-2 ">
                        <div
                          style={{ height: "250px" }}
                          className="rounded border p-2 overflow-auto"
                          key={index}
                        >
                          <h3>Address {index + 1}</h3>
                          <hr className="my-1" />
                          <p>
                            Name: {address.fName} {address.lName}
                          </p>
                          <p>Address: {address.address}</p>
                          <p>City: {address.city}</p>
                          <p>State: {address.state}</p>
                          <p>Zip Code: {address.pin}</p>
                          <p>Phone: {address.phone}</p>
                        </div>
                      </Col>
                    );
                  })}{" "}
              </Row>
            </Card.Body>
          </Card>
        </Row>
      )}
    </Container>
  );
};

export default Profile;
