import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Input } from "../../components/form/Input";
import { Select } from "../../components/form/Select";
import axios from "axios";
import { useCart } from "../../context/cartContext";
import "./CheckOut.css";
import { useNavigate } from "react-router-dom";
import Message from "../../components/message/Message";
import {
  BsCheck2Circle,
  BsFillHouseDoorFill,
  BsFillWalletFill,
} from "react-icons/bs";

export const CheckOut = () => {
  //get cart state from context
  const { cartState, cartDispatch } = useCart();
  // user all saved address will be stored
  const [savedAddress, setSavedAddress] = useState([]);
  // address for this order
  //eslint-disable-next-line
  const [shippingAddress, setShippingAddress] = useState({});
  // this is used for default address selection to mark the radio buttons (primary address)
  const [selectedAddress, setSelectedAddress] = useState([]);
  // to toggle the address form
  const [showAddressForm, setShowAddressForm] = useState(true);
  // to store user id
  const [userId, setUserId] = useState();
  // to store all the details of address form fields
  const [formFields, setFormFields] = useState({
    fName: "",
    lName: "",
    phone: "",
    address: "",
    pin: "",
    landMark: "",
    state: "",
    city: "",
    isPrimary: false,
  });

  // state variables to keep track of the current step and form data
  const [currentStep, setCurrentStep] = useState(1);

  //payment method COD
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // price calculation
  const [totalPrice, setTotalPrice] = useState(0);
  //eslint-disable-next-line
  const [shippingCharge, setShippingCharge] = useState(100);

  // list of all the states of india
  const states = [
    {
      key: "AN",
      name: "Andaman and Nicobar Islands",
    },
    {
      key: "AP",
      name: "Andhra Pradesh",
    },
    {
      key: "AR",
      name: "Arunachal Pradesh",
    },
    {
      key: "AS",
      name: "Assam",
    },
    {
      key: "BR",
      name: "Bihar",
    },
    {
      key: "CG",
      name: "Chandigarh",
    },
    {
      key: "CH",
      name: "Chhattisgarh",
    },
    {
      key: "DH",
      name: "Dadra and Nagar Haveli",
    },
    {
      key: "DD",
      name: "Daman and Diu",
    },
    {
      key: "DL",
      name: "Delhi",
    },
    {
      key: "GA",
      name: "Goa",
    },
    {
      key: "GJ",
      name: "Gujarat",
    },
    {
      key: "HR",
      name: "Haryana",
    },
    {
      key: "HP",
      name: "Himachal Pradesh",
    },
    {
      key: "JK",
      name: "Jammu and Kashmir",
    },
    {
      key: "JH",
      name: "Jharkhand",
    },
    {
      key: "KA",
      name: "Karnataka",
    },
    {
      key: "KL",
      name: "Kerala",
    },
    {
      key: "LD",
      name: "Lakshadweep",
    },
    {
      key: "MP",
      name: "Madhya Pradesh",
    },
    {
      key: "MH",
      name: "Maharashtra",
    },
    {
      key: "MN",
      name: "Manipur",
    },
    {
      key: "ML",
      name: "Meghalaya",
    },
    {
      key: "MZ",
      name: "Mizoram",
    },
    {
      key: "NL",
      name: "Nagaland",
    },
    {
      key: "OR",
      name: "Odisha",
    },
    {
      key: "PY",
      name: "Puducherry",
    },
    {
      key: "PB",
      name: "Punjab",
    },
    {
      key: "RJ",
      name: "Rajasthan",
    },
    {
      key: "SK",
      name: "Sikkim",
    },
    {
      key: "TN",
      name: "Tamil Nadu",
    },
    {
      key: "TS",
      name: "Telangana",
    },
    {
      key: "TR",
      name: "Tripura",
    },
    {
      key: "UP",
      name: "Uttar Pradesh",
    },
    {
      key: "UK",
      name: "Uttarakhand",
    },
    {
      key: "WB",
      name: "West Bengal",
    },
  ];

  //navigate
  const navigate = useNavigate();

  //function to handel value from input component
  const handelChildChanges = (fieldName, value) => {
    console.log("fieldname, value", fieldName, value);
    setFormFields((prevFields) => ({
      ...prevFields,
      [fieldName]: value,
    }));
  };

  //function to get all saved addresses w.r.t user
  const getAddress = async () => {
    try {
      const response = await axios.get(
        `/shipping/shipping-address/${cartState.user._id}`
      );
      console.log(response.data);
      if (response.data.success) {
        const addresses = response.data.address;
        const primaryAddress = addresses.filter((address) => address.isPrimary);
        // selected address means this is selected by user to delivered the product
        // if user has primary address then onload this will be selected
        setSelectedAddress(primaryAddress[0]);

        //default address to delivered the product
        setShippingAddress({
          name: primaryAddress[0]?.fName + " " + primaryAddress[0]?.lName,
          address: primaryAddress[0]?.address,
          phone: primaryAddress[0]?.phone,
          pin: primaryAddress[0]?.pin,
          landMark: primaryAddress[0]?.landMark,
        });

        cartDispatch({
          type: "SHIPPING_ADDRESS",
          payload: {
            name: primaryAddress[0]?.fName + " " + primaryAddress[0]?.lName,
            address: primaryAddress[0]?.address,
            phone: primaryAddress[0]?.phone,
            pin: primaryAddress[0]?.pin,
            landMark: primaryAddress[0]?.landMark,
          },
        });
        console.log(
          "response.data.address.length",
          response.data.address.length
        );
        if (response.data.address.length > 0) {
          setShowAddressForm(false);
        }

        //will loop through this address and show in all address section
        setSavedAddress(response.data.address);

        console.log("saved address", savedAddress);
        console.log("new address");
      }
    } catch (error) {
      console.log(error);
      Message({
        type: "error",
        message: error?.response?.data?.message ?? error?.message ?? error,
      });
    }
  };

  //function to handel the add address form submission
  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `/shipping/shipping-address/${cartState.user._id}`,
        formFields,
        {
          headers: {
            Authorization: cartState.token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        //show alert with success message
        handelAddAddress();
        getAddress();
        Message({ type: "success", message: response.data.message });
      }
    } catch (error) {
      console.log(error);
      Message({ type: "error", message: error.response.data.message });
    }
  };

  //function to handel the current shipping address where product will be shiped
  const handelShippingAddress = (adss) => {
    setShippingAddress({
      name: adss.fName + " " + adss.lName,
      address: adss.address,
      phone: adss.phone,
      pin: adss.pin,
      landMark: adss.landMark,
    });
    cartDispatch({
      type: "SHIPPING_ADDRESS",
      payload: {
        name: adss.fName + " " + adss.lName,
        address: adss.address,
        phone: adss.phone,
        pin: adss.pin,
        landMark: adss.landMark,
      },
    });
  };

  //function to toggle the add address form and button
  const handelAddAddress = () => {
    setShowAddressForm(!showAddressForm);
  };

  //function to review order
  const reviewOrder = (payment) => {
    try {
      navigate(
        `/user/reviewOrder?payment=${payment}&address=${JSON.stringify(
          cartState.shippingAddress
        )}`
      );
    } catch (error) {
      Message({ type: "error", message: "Something went wrong" });
      console.log(error);
    }
  };
  useEffect(() => {
    setUserId(cartState.user._id);
  }, [cartState.user._id]);

  useEffect(() => {
    if (userId) {
      getAddress();
    }
    // eslint-disable-next-line
  }, [userId]);

  useEffect(() => {
    const total = cartState.cartItems.reduce(
      (price, item) => price + item.quantity * item.price,
      0
    );
    setTotalPrice(total);
  }, [cartState.cartItems]);

  //function to handle moving to the next step
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
    console.log(currentStep);
  };

  //function to handle moving to the previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Calculate progress percentage
  const progress =
    currentStep === 1
      ? currentStep * 14
      : currentStep === 2
      ? currentStep * 20
      : 4 * 20;
  const getIconForStep = (step) => {
    switch (step) {
      case 1:
        return <BsFillHouseDoorFill />;
      case 2:
        return <BsFillWalletFill />;
      case 3:
        return <BsCheck2Circle />;

      default:
        return null;
    }
  };

  return (
    <>
      <div className="container">
        <div className="wizard-container">
          <div className="progress-bar-container">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className={`progress-step ${
                  currentStep === i + 1 ? "active" : ""
                } ${i < currentStep ? "text-5" : ""}`}
              >
                <span className="circle">{getIconForStep(i + 1)}</span>
              </div>
            ))}
          </div>
        </div>
        <div
          className="progress-line"
          style={{
            width: `${progress}%`,
          }}
        ></div>{" "}
      </div>

      <hr />

      <Container className="p-2 p-md-5">
        <Row className="p-3 justify-content-center align-items-start">
          {currentStep === 1 && (
            <Col className="p-0 me-md-2" sx={12} md={7}>
              <div className="card">
                <div className="card-header">Select shipping address</div>
                <div className="card-body">
                  <>
                    {savedAddress &&
                      savedAddress.map((address) => {
                        return (
                          <div
                            key={address._id}
                            className="border p-2 rounded row justify-content-between align-items-center mb-2"
                          >
                            <input
                              key={address._ids + "input"}
                              type="radio"
                              name="primary"
                              value={address}
                              checked={selectedAddress?._id === address._id}
                              onChange={(e) => {
                                console.log("on change", address);
                                setSelectedAddress(address);
                                handelShippingAddress(address);
                              }}
                              className=" col-2"
                            />
                            <label
                              key={address._ids + "label"}
                              className=" col-10"
                            >
                              {" "}
                              <span>
                                {address.fName + " " + address.lName},
                                {address.address}, {address.phone},{" "}
                                {address.pin}
                              </span>
                            </label>
                          </div>
                        );
                      })}
                  </>

                  {!showAddressForm && (
                    <div className="d-flex justify-content-end">
                      <button
                        onClick={handelAddAddress}
                        className="btn bg-3 text-2"
                      >
                        Add a Address
                      </button>
                    </div>
                  )}

                  {showAddressForm && (
                    <div className="border rounded">
                      <form
                        className=" m-auto p-3 col-md-10"
                        onSubmit={(e) => handelSubmit(e)}
                      >
                        <h6 className="text-2 fw-bold">
                          Enter Shipping Details
                        </h6>
                        <div className="row ">
                          <div className="col-12 col-md-6">
                            <Input
                              className=" mb-1"
                              fieldName="fName"
                              onChange={handelChildChanges}
                              name={"First Name"}
                              type="text"
                              key="fName"
                            />
                          </div>
                          <div className="col-12 col-md-6">
                            <Input
                              className="col-md-6 mb-1"
                              fieldName="lName"
                              key="lName"
                              onChange={handelChildChanges}
                              name={"Last Name"}
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <Input
                              fieldName="phone"
                              key="phone"
                              onChange={handelChildChanges}
                              className="mb-1"
                              name="Phone"
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <Input
                              fieldName="address"
                              key="address"
                              onChange={handelChildChanges}
                              className="mb-1"
                              name="Address"
                              type="textarea"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <Input
                              fieldName="landMark"
                              key="landMark"
                              onChange={handelChildChanges}
                              className="mb-1"
                              name="Landmark"
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-4">
                            <Select
                              fieldName="state"
                              key="state"
                              onChange={handelChildChanges}
                              className="mb-1"
                              name="State"
                              type="text"
                              options={states}
                            />
                          </div>
                          <div className="col-md-4">
                            <Input
                              fieldName="city"
                              key="city"
                              onChange={handelChildChanges}
                              className="mb-1"
                              name="City"
                              type="text"
                            />
                          </div>
                          <div className="col-md-4">
                            <Input
                              fieldName="pin"
                              key="pin"
                              onChange={handelChildChanges}
                              className="mb-1"
                              name="Pin/Zip code"
                              type="text"
                            />
                          </div>
                        </div>

                        <div className="form-check">
                          <Input
                            fieldName="isPrimary"
                            key="isPrimary"
                            onChange={handelChildChanges}
                            className="form-check-input mb-1"
                            name="IsPrimary"
                            type="checkbox"
                            id="flexCheckDefault"
                          />
                          <label
                            className="ms-1 form-check-label"
                            for="flexCheckDefault"
                          >
                            Make it primary address
                          </label>
                        </div>

                        <div className="d-flex pt-2">
                          <button
                            className="ms-auto btn bg-3 text-2"
                            style={{ borderRadius: "2px !important" }}
                          >
                            Save Shipping Address
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-2"></div>
            </Col>
          )}
          {currentStep === 3 && (
            <Col className=" shadow rounded mt-3 mt-md-0 pt-1 " sx={12} md={4}>
              <h1 className="text-center">Cart Summary</h1>
              <hr className="my-1" />
              <p className="m-0 p-1 d-flex justify-content-between">
                <span className="text-2">Price</span>
                <span className="text-3">
                  <span className="rupee">&#8377;</span>{" "}
                  <span>{totalPrice}</span>
                </span>
              </p>
              <p className="m-0 p-1 d-flex justify-content-between">
                <span className="text-2">Shipping Charge:</span>
                <span className="text-3">
                  <span className="rupee">&#8377;</span>{" "}
                  <span>{shippingCharge}</span>
                </span>
              </p>
              <hr className="my-1" />
              <p className="m-0 p-1 d-flex justify-content-between">
                <span className="text-2">Estimated Total:</span>
                <span className="text-3">
                  <span className="rupee">&#8377;</span>
                  <span>{totalPrice + shippingCharge}</span>
                </span>
              </p>
              <div className="d-flex justify-content-end my-2">
                <button
                  onClick={() => {
                    reviewOrder(paymentMethod);
                  }}
                  className="btn bg-3 text-2"
                >
                  Review order
                </button>
              </div>
            </Col>
          )}

          {currentStep === 2 && (
            <Col xs={12} md={5} className="p-3">
              <Row className="justify-content-center border rounded p-3">
                <h3 className="text-center">select payment</h3>
                <hr className="my-1" />
                <div className="">
                  <div className="form-check">
                    <label className="form-check-label pointer">
                      <input
                        value="COD"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="form-check-input"
                        type="radio"
                        id="cod"
                        name="paymentMethod"
                        checked={paymentMethod === "COD"}
                      />
                      COD
                    </label>
                  </div>
                  <div className="form-check">
                    <label className="form-check-label pointer">
                      <input
                        value="PAYPAL"
                        checked={paymentMethod === "PAYPAL"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="form-check-input"
                        type="radio"
                        id="paypal"
                        name="paymentMethod"
                      />
                      Paypal
                    </label>
                  </div>
                </div>
              </Row>
            </Col>
          )}

          <div className="d-flex justify-content-center py-3">
            <div className="d-flex justify-content-center col-12 col-md-3 col-lg-3">
              {currentStep > 1 && (
                <button
                  className="btn bg-3 me-3 rounded px-3"
                  onClick={prevStep}
                  style={{ width: "6rem" }}
                >
                  Previous
                </button>
              )}
              {currentStep < 3 && (
                <button
                  className="btn bg-3 rounded px-3"
                  onClick={nextStep}
                  style={{ width: "6rem" }}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </Row>
      </Container>
    </>
  );
};
