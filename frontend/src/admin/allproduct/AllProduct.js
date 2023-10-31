import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import Sidebar from "../component/sidebar/Sidebar";
import axios from "axios";
import { useCart } from "../../context/cartContext";
import { BsFillEyeFill, BsXSquareFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Message from "../../components/message/Message.js";

function AllProduct() {
  const [toggleSideBar, setToggleSideBar] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  const { cartState } = useCart();

  const navigate = useNavigate();

  const handelSideBar = () => {
    setToggleSideBar(!toggleSideBar);
  };

  const getAllProducts = async (page = 1) => {
    try {
      const response = await axios.get(`/product/allproducts/${page}`);
      if (response.data?.success) {
        setAllProducts(response.data?.products);
      }
    } catch (error) {
      console.log(error);
      Message({ type: "error", message: error.response.data.message });
    }
  };

  const productDetails = (productId) => {
    try {
      console.log(productId);
      navigate(`/admin/view-product/${productId}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (cartState.token) {
      getAllProducts();
    }
    //eslint-disable-next-line
  }, [cartState.token]);

  return (
    <Container fluid>
      <Row>
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
          <div className="d-md-none d-flex justify-content-end">
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
          <h4 className="text-2">Dashboard</h4>
          <hr className="my-2" />
          <h6>All Products</h6>
          <div className="table-responsive">
            <Table bordered hover size="sm table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allProducts &&
                  allProducts.map((product, index) => {
                    return (
                      <tr key={product._id}>
                        <td>{index + 1}</td>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>{product.price}</td>
                        <td>{product.category}</td>
                        <td>{product.quantity}</td>
                        <td>
                          <button
                            onClick={() => productDetails(product._id)}
                            className="btn"
                          >
                            <BsFillEyeFill />{" "}
                          </button>
                          {/* <button className="btn">
                          <BsPencilSquare />
                        </button> */}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AllProduct;
