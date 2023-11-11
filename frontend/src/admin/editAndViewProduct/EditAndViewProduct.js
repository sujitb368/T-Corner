import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsPencilSquare, BsXSquareFill } from "react-icons/bs";
import { useParams } from "react-router-dom";
import Message from "../../components/message/Message";
import { useCart } from "../../context/cartContext";
import { Col } from "react-bootstrap";
import Sidebar from "../component/sidebar/Sidebar";
import { baseUrl } from "../../constant";

const EditAndViewProduct = () => {
  const { cartState } = useCart();
  const [isEditing, setEditing] = useState(false);
  const [isImageEditing, setImageEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("In Stock");
  const [colors, setColors] = useState([]);
  const [size, setSize] = useState([]);
  const [fileName, setFileName] = useState("");
  const [image, setImage] = useState({
    preview: "",
    data: "",
  });

  const [toggleSideBar, setToggleSideBar] = useState(false);

  const { productId } = useParams();

  const handelSideBar = () => {
    setToggleSideBar(!toggleSideBar);
  };

  //function to toggle the state of editing of details form
  const handleEditClick = () => {
    setEditing(!isEditing);
  };

  const handleEditImageClick = () => {
    setImageEditing(!isImageEditing);
  };

  const getProduct = async () => {
    try {
      const { data } = await axios.get(`/product/getProductId/${productId}`);
      setName(data?.product[0]?.name);
      setDescription(data?.product[0]?.description);
      setPrice(data?.product[0]?.price);
      setCategory(data?.product[0]?.category);
      setQuantity(data?.product[0]?.quantity);
      setShipping(data?.product[0]?.shipping);
      setSize(data?.product[0]?.size);
      setColors(data?.product[0]?.color);
      setFileName(data?.product[0]?.image);
    } catch (error) {
      Message({ type: "error", message: error.response.data.message });
    }
  };

  //function to handel size and color as this can have multiple values so using array
  const handelColorAndSize = (value, setState) => {
    // Split the comma-separated values and store them in the 'colors' state
    const valueArray = value.split(",").map((color) => color.trim());
    if (valueArray.length) {
      setState(valueArray);
    }
  };

  const handleSave = async () => {
    try {
      const { data } = await axios.put(
        `/admin/product/updateProduct/${productId}`,
        {
          name,
          description,
          price,
          category,
          quantity,
          shipping,
          colors,
          size,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: cartState.token,
          },
        }
      );
      if (data.success) {
        Message({ type: "success", message: data.message });
      }
    } catch (error) {
      Message({
        type: "error",
        message: error.response?.data?.message ?? "Something went wrong",
      });
    }
  };

  //function to handel the file(image) selected by admin to change the image of product
  const handleFileSelect = (event) => {
    try {
      const img = {
        preview: URL.createObjectURL(event.target.files[0]),
        data: event.target.files[0],
      };
      //set the value of state variable `image` with `img` from above object
      setImage(img);
    } catch (error) {
      console.log("error: " + error);
    }
  };

  //function to change the product image
  const handleImageSave = async () => {
    try {
      const formData = new FormData();
      formData.append("file", image.data);

      if (!image.data) {
        Message({ type: "error", message: "Image is mandatory for post" });

        return;
      }
      const { data } = await axios.put(
        `/admin/files/edit-image/${productId}`,
        formData,
        {
          headers: {
            Authorization: cartState.token,
          },
        }
      );
      const { filename } = data;
      setFileName(filename);

      setImageEditing(false);

      Message({ type: "success", message: "Image Changed successfully" });
    } catch (error) {
      console.log(error);
      Message({
        type: "error",
        message: error?.response?.data?.message ?? "Something went wrong",
      });
    }
  };

  useEffect(
    () => {
      getProduct();
    },
    //eslint-disable-next-line
    []
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <Col
          xs={8}
          md={2}
          className={`side-bar pt-5 side-bar-responsive bg-2 ${
            toggleSideBar ? "side-bar-responsive-toggle" : ""
          }`}
        >
          <Sidebar />
        </Col>
        <Col className={`bg-4 pt-4 `} xs={window.innerWidth <= 830 ? 12 : 10}>
          <div className="d-md-none d-flex justify-content-end mb-3">
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
          <div className="card rounded shadow">
            <div className="card-header d-flex bg-1 text-3 align-items-center justify-content-between">
              <h2 className="">Edit Product</h2>

              <span className="float-right btn text-3">
                <BsPencilSquare
                  size={24}
                  className="text-3"
                  onClick={handleEditClick}
                />
              </span>
            </div>

            <div className="card-body row m-0">
              <div className="col-md-4 pt-3 px-3">
                {image.preview.length > 0 ? (
                  <img
                    src={image.preview}
                    alt="Product"
                    className="card-img-top rounded-left"
                  />
                ) : (
                  <img
                    src={`${baseUrl}/files/get-file/${fileName}`}
                    alt="Product"
                    className="card-img-top rounded-left"
                  />
                )}
                {isImageEditing ? (
                  <>
                    <input
                      onChange={(e) => handleFileSelect(e)}
                      type="file"
                      placeholder="Choose a file"
                      className="form-control mt-2"
                    />
                    <button
                      type="button"
                      className="btn btn-primary mt-2"
                      onClick={handleImageSave}
                    >
                      Save Image
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary mt-2"
                      onClick={handleEditImageClick}
                    >
                      Edit Image
                    </button>
                  </>
                )}
              </div>

              <div className="col-md-8 pt-3 pe-3">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Product Title: </label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Product Description: </label>
                    {isEditing ? (
                      <textarea
                        rows="1"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        value={description}
                        disabled
                      />
                    )}
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label">Price: </label>
                      <input
                        type="text"
                        className="form-control"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col">
                      <label className="form-label">Quantity: </label>
                      <input
                        type="text"
                        className="form-control"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label">Shipping: </label>

                      <select
                        className={`form-select br-2 `}
                        onChange={(e) => setShipping(e.target.value)}
                        disabled={!isEditing}
                      >
                        <option
                          selected={shipping === "true" || shipping === true}
                          value="true"
                        >
                          Yes
                        </option>
                        <option
                          selected={shipping === "false" || shipping === false}
                          value="false"
                        >
                          No
                        </option>
                      </select>
                    </div>
                    <div className="col">
                      <label className="form-label">
                        Colors: Use comma(,) separated for multiple color
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={colors}
                        onChange={(e) =>
                          handelColorAndSize(e.target.value, setColors)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Size: Use comma(,) separated for multiple Size{" "}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={size}
                      onChange={(e) =>
                        handelColorAndSize(e.target.value, setSize)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  {isEditing ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleEditClick}
                    >
                      Edit
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </Col>
      </div>
    </div>
  );
};

export default EditAndViewProduct;
