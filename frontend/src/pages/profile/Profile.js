// Profile
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import { useCart } from "../../context/cartContext";
import "./Profile.css";
import { BsCamera, BsPencilSquare, BsXSquareFill } from "react-icons/bs";
import axios from "axios";
import Message from "../../components/message/Message";
import { baseUrl } from "../../constant";
import Sidebar from "../../admin/component/sidebar/Sidebar";

//component function
const Profile = () => {
  //eslint-disable-next-line
  const { cartState, cartDispatch } = useCart();

  const [isEditing, setEditing] = useState(false);

  // state variable to store user all saved addresss
  const [addresses, setAddresses] = useState();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [editProfileImage, setEditProfileImage] = useState(false);

  const [image, setImage] = useState({
    preview: "",
    data: "",
  });

  //state variable to enable editing of shipping address
  // const [editShippingAddress, setEditShippingAddress] = useState(false)

  const [showModal, setShowModal] = useState(false);
  const [idOfShippingAddress, setIdOfShippingAddress] = useState({
    index: "",
    id: "",
  });

  const [toggleSideBar, setToggleSideBar] = useState(false);

  // State to hold the updated address data
  const [updatedAddress, setUpdatedAddress] = useState({
    _id: "",
    fName: "",
    lName: "",
    address: "",
    city: "",
    state: "",
    pin: "",
    phone: "",
    landMark: "",
  });

  //function to get all saved addresses w.r.t user
  const getAddress = async (userId) => {
    try {
      const response = await axios.get(`/shipping/shipping-address/${userId}`);
      if (response?.data?.success) {
        const addresses = response.data.address;
        // selected address means this is selected by user to deliverd the product

        const shippingAddress = addresses.map((address) => address);

        // set the all saved address
        setAddresses(shippingAddress);
      }
    } catch (error) {
      console.log(error);
      Message({ type: "error", message: error?.response?.data?.message });
    }
  };

  const handleEditClick = () => {
    setEditing(!isEditing);
  };

  const handelSave = async () => {
    try {
      const { data } = await axios.put(
        `/user/edit/${cartState.user._id}`,
        userData,
        {
          "Content-Type": "application/json",
          Authorization: cartState.token,
        }
      );
      if (data?.success) {
        Message({ type: "success", message: data.message });
        setEditing(false);
        localStorage.setItem("user", JSON.stringify(data?.user));
        cartDispatch({ type: "LOAD_USER", payload: data?.user });
      }
    } catch (error) {
      Message({
        type: "error",
        message: error?.response?.data?.message ?? "Something went wrong",
      });
    }
  };

  //to set and preview the image
  const handelImage = async () => {
    try {
      document.getElementById("profile-image").click();
    } catch (error) {
      console.log(error);
    }
  };

  //function to handel image selection from system
  const handleFileSelect = (event) => {
    try {
      const img = {
        preview: URL.createObjectURL(event.target.files[0]),
        data: event.target.files[0],
      };
      //set the value of state variable `image` with `img` from above object
      setImage(img);
      setEditProfileImage(true);

      console.log("after file selection");
    } catch (error) {
      console.log("error: " + error);
    }
  };

  //function to change profile picture
  const handelImageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", image.data);

      if (!image.data) {
        Message({ type: "error", message: "Image is mandatory for post" });

        return;
      }
      const { data } = await axios.put(
        `/files/profile-image/${cartState.user._id}`,
        formData,
        {
          headers: {
            Authorization: cartState.token,
          },
        }
      );

      if (data?.success) {
        Message({ type: "success", message: data?.message });
        setEditProfileImage(false);
        localStorage.setItem("user", JSON.stringify(data?.user));
        cartDispatch({ type: "LOAD_USER", payload: data?.user });
      }
    } catch (error) {
      Message({
        type: "error",
        message: error?.response?.data?.message ?? "Something went wrong",
      });
    }
  };

  // Function to update the address data
  const handleUpdate = async () => {
    try {
      const { data } = await axios.put(
        `/shipping/edit-address/${cartState.user._id}`,
        updatedAddress,
        {
          headers: {
            "content-type": "application/json",
            Authorization: cartState.token,
          },
        }
      );

      if (data?.success) {
        Message({ type: "success", message: data?.message });
        setAddresses(data.addresses);
      }
      setShowModal(false);
    } catch (error) {
      Message({
        type: "error",
        message: error?.response?.data?.message ?? "Something went wrong",
      });
    }
  };

  const handelSideBar = () => {
    setToggleSideBar(!toggleSideBar);
  };

  useEffect(() => {
    if (cartState.token && !cartState.user.isAdmin) {
      getAddress(cartState.user._id);
    }

    if (cartState.user) {
      setUserData({
        name: cartState.user.name,
        email: cartState.user.email,
        phone: cartState.user.phone,
      });
    }
  }, [
    cartState.token,
    cartState.user._id,
    cartState.user,
    cartState.user.isAdmin,
  ]);

  return (
    <div
      className={` ${
        cartState.user?.isAdmin ? "container-fluid" : "container"
      }`}
    >
      <Row>
        {cartState.user?.isAdmin && (
          <Col
            xs={8}
            md={2}
            className={`side-bar pt-5 side-bar-responsive bg-2 ${
              toggleSideBar ? "side-bar-responsive-toggle" : ""
            }`}
          >
            <Sidebar />
          </Col>
        )}
        <Col md={6}>
          {cartState.user?.isAdmin && (
            <div className="mt-3 d-md-none d-flex justify-content-end">
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
          )}
          <Card className="mt-5 mb-5 rounded shadow">
            <Card.Header
              className="d-flex bg-1 text-3 align-items-center justify-content-between"
              as="h5"
            >
              {cartState.user?.isAdmin ? "Admin Profile" : "User Profile"}
              <span className="float-right btn text-3">
                <BsPencilSquare
                  size={24}
                  color="text-3"
                  onClick={handleEditClick}
                />
              </span>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col
                  className="d-flex justify-content-center flex-column align-items-center border-right"
                  md={4}
                >
                  <>
                    <div className=" profile-image-container border border-4 rounded-circle">
                      <Image
                        src={
                          image.preview
                            ? image.preview
                            : cartState.user?.profilePic?.includes(
                                "https://www."
                              )
                            ? cartState.user?.profilePic
                            : `${baseUrl}/files/get-file/${cartState.user?.profilePic}`
                        }
                        roundedCircle
                        fluid
                        alt="Profile"
                        className="profile-image  "
                      />
                      <div className="overlay">
                        <label
                          htmlFor="profileImageInput"
                          className="camera-icon"
                          onClick={handelImage}
                        >
                          <BsCamera />
                        </label>
                        <input
                          id="profile-image"
                          className="d-none"
                          type="file"
                          onChange={(e) => handleFileSelect(e)}
                        />
                      </div>
                    </div>
                    {editProfileImage && (
                      <div className="mt-1">
                        <button
                          className="btn bg-3 text-1"
                          onClick={handelImageUpload}
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </>
                </Col>
                <Col md={8}>
                  <div>
                    <label className="form-label">Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={userData.name}
                      onChange={(e) =>
                        setUserData({ ...userData, name: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="form-label">Email:</label>
                    <input
                      type="text"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                      className="form-control"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone:</label>
                    <input
                      type="text"
                      value={userData.phone}
                      onChange={(e) =>
                        setUserData({ ...userData, phone: e.target.value })
                      }
                      className="form-control"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <button
                      className="btn bg-3 text-1 mt-2"
                      onClick={handelSave}
                    >
                      Save
                    </button>
                  </div>
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
            <Card.Header
              className="d-flex bg-1 text-3 align-items-center justify-content-between bg-1 text-3"
              as="h5"
            >
              Shipping Address
            </Card.Header>

            <Card.Body className="p-3">
              <Row>
                {addresses &&
                  addresses.map((address, index) => {
                    return (
                      <Col key={address._id} className="col-md-4 col-6 mb-2 ">
                        <div
                          style={{ height: "250px" }}
                          className="rounded border overflow-auto"
                          key={index}
                        >
                          <h3 className="bg-1 text-3 p-2">
                            Address {index + 1}
                            <span className="float-right btn text-3">
                              <BsPencilSquare
                                size={24}
                                color="text-3"
                                onClick={() => {
                                  setShowModal(true);
                                  setUpdatedAddress({
                                    _id: address._id,
                                    fName: address.fName,
                                    lName: address.lName,
                                    address: address.address,
                                    city: address.city,
                                    state: address.state,
                                    pin: address.pin,
                                    phone: address.phone,
                                    landMark: address.landMark,
                                  });
                                  setIdOfShippingAddress({
                                    index: index + 1,
                                    id: address._id,
                                  });
                                }}
                              />
                            </span>
                          </h3>

                          <div className="p-2">
                            <p>
                              Name: {address.fName} {address.lName}
                            </p>
                            <p>Address: {address.address}</p>
                            <p>City: {address.city}</p>
                            <p>State: {address.state}</p>
                            <p>Zip Code: {address.pin}</p>
                            <p>Phone: {address.phone}</p>
                          </div>
                        </div>
                        <div
                          className={`modal fade ${showModal ? "show" : ""}`}
                          tabIndex="-1"
                          role="dialog"
                          style={{ display: showModal ? "block" : "none" }}
                        >
                          <div className="modal-dialog" role="document">
                            <div className="modal-content">
                              <div className="modal-header bg-1 text-3">
                                <h5 className="modal-title">
                                  Edit Address {idOfShippingAddress.index}
                                </h5>
                                <button
                                  type="button"
                                  className="close btn bg-3 text-1"
                                  onClick={() => setShowModal(false)}
                                >
                                  <span>&times;</span>
                                </button>
                              </div>
                              <div className="modal-body row ">
                                {/* Form fields to edit the address */}
                                <div className="form-group col-md-6">
                                  <label htmlFor="fName">First Name</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="fName"
                                    value={updatedAddress.fName}
                                    onChange={(e) =>
                                      setUpdatedAddress({
                                        ...updatedAddress,
                                        fName: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="form-group col-md-6">
                                  <label htmlFor="lName">Last Name</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="lName"
                                    value={updatedAddress.lName}
                                    onChange={(e) =>
                                      setUpdatedAddress({
                                        ...updatedAddress,
                                        lName: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="form-group col-md-6">
                                  <label htmlFor="address">Address</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="address"
                                    value={updatedAddress.address}
                                    onChange={(e) =>
                                      setUpdatedAddress({
                                        ...updatedAddress,
                                        address: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="form-group col-md-6">
                                  <label htmlFor="city">City</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="city"
                                    value={updatedAddress.city}
                                    onChange={(e) =>
                                      setUpdatedAddress({
                                        ...updatedAddress,
                                        city: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="form-group col-md-6">
                                  <label htmlFor="state">State</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="state"
                                    value={updatedAddress.state}
                                    onChange={(e) =>
                                      setUpdatedAddress({
                                        ...updatedAddress,
                                        state: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="form-group col-md-6">
                                  <label htmlFor="pin">Zip Code</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="pin"
                                    value={updatedAddress.pin}
                                    onChange={(e) =>
                                      setUpdatedAddress({
                                        ...updatedAddress,
                                        pin: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="form-group col-md-6">
                                  <label htmlFor="phone">Phone</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="phone"
                                    value={updatedAddress.phone}
                                    onChange={(e) =>
                                      setUpdatedAddress({
                                        ...updatedAddress,
                                        phone: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="form-group col-md-6">
                                  <label htmlFor="landMark">Landmark</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="landMark"
                                    value={updatedAddress.landMark}
                                    onChange={(e) =>
                                      setUpdatedAddress({
                                        ...updatedAddress,
                                        landMark: e.target.value,
                                      })
                                    }
                                  />
                                </div>

                                {/* Add similar form fields for other address fields */}
                              </div>
                              <div className="modal-footer">
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  onClick={() => setShowModal(false)}
                                >
                                  Close
                                </button>
                                <button
                                  type="button"
                                  className="btn bg-3"
                                  onClick={() => handleUpdate(address._id)}
                                >
                                  Save Changes
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* End of Modal */}
                      </Col>
                    );
                  })}{" "}
              </Row>
            </Card.Body>
          </Card>
        </Row>
      )}
    </div>
  );
};

export default Profile;
