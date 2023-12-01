import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import Sidebar from "../component/sidebar/Sidebar";
import axios from "axios";
import { useCart } from "../../context/cartContext";
import { BsFillEyeFill, BsTrash3Fill, BsXSquareFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import Message from "../../components/message/Message.js";

function AllProduct() {
  // State for sidebar toggle
  const [toggleSideBar, setToggleSideBar] = useState(false);

  // State for storing all products
  const [allProducts, setAllProducts] = useState([]);

  // for total pages in pagination
  const [totalPages, setTotalPages] = useState(5);

  //for the current page in pagination
  const [page, setPage] = useState(1);

  // State to identify the source of products (all/search)

  const [productFrom, setProductFrom] = useState("all");

  // Cart context for accessing user token and search query

  const { cartState, cartDispatch } = useCart();

  // Navigation hook for page redirection

  const navigate = useNavigate();

  // Function to toggle the sidebar
  const handelSideBar = () => {
    setToggleSideBar(!toggleSideBar);
  };

  // Function to fetch all products
  const getAllProducts = async (page = 1) => {
    //dont call api for malay da
    return;
    //eslint-disable-next-line
    try {
      const response = await axios.get(`/product/allproducts/${page}`);
      if (response?.data?.success) {
        setAllProducts(response?.data?.products);
        // set total page
        setTotalPages(response?.data?.totalPage);
        // set current page
        setPage(response?.data?.currentPage);
      }
    } catch (error) {
      console.log(error);
      Message({
        type: "error",
        message: error?.response?.data?.message ?? error?.message,
      });
    }
  };

  // Function to fetch search products
  const getSearchProducts = async (currentPage = 1) => {
    //dont call api for malay da
    return;
    //eslint-disable-next-line
    try {
      const { data } = await axios.get(
        `/product/search?query=${cartState.searchQuery}&page=${currentPage}&perPage=10`
      );

      if (data?.success) {
        setAllProducts(data.products);
        // set total page
        setTotalPages(data.totalPage);
        // set current page
        setPage(data.currentPage);
        if (!data.products.length) {
          setProductFrom("");
          cartDispatch({ type: "SEARCH", payload: "" });
        }
        Message({ type: "success", message: data.message });
      }
    } catch (error) {
      Message({
        type: "success",
        message: error.response.data.message ?? "something went wrong",
      });
      console.error(error);
    }
  };

  //function to get the details of product
  const productDetails = (productId) => {
    try {
      navigate(`/admin/view-product/${productId}`);
    } catch (error) {
      console.log(error);
    }
  };

  //function to handel the product source (all/searched)
  const handlePageChange = (currentPage) => {
    if (productFrom === "search") {
      getSearchProducts(currentPage);
    } else {
      getAllProducts(currentPage);
    }
  };

  //function to handel previous and next button in pagination
  const handelNextPrevious = async (currentPage) => {
    if (productFrom === "search") {
      getSearchProducts(currentPage);
    } else {
      getAllProducts(currentPage);
    }
  };

  //function to delete product
  const deleteProduct = async (productId) => {
    //dont call api for malay da
    try {
      const { data } = await axios.delete(`/product/delete/${productId}`, {
        headers: {
          Authorization: cartState.token,
        },
      });
      if (data?.success) {
        Message({ type: "success", message: data.message });
        getAllProducts();
      }
    } catch (error) {
      Message({
        type: "error",
        message:
          error?.response?.data?.message ??
          error.message ??
          "Something went wrong",
      });
    }
  };

  useEffect(() => {
    if (cartState.token) {
      getAllProducts();
    }
    //eslint-disable-next-line
  }, [cartState.token]);

  useEffect(() => {
    if (cartState.searchQuery !== "all") {
      getSearchProducts();
    }
    if (cartState.searchQuery === "all") {
      getAllProducts();
    }
    //eslint-disable-next-line
  }, [cartState.searchQuery]);

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
          {!allProducts.length && (
            <p className="text-danger fw-1 fs-2 text-center">
              No more products...
            </p>
          )}
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
                            className="btn bg-3 me-1"
                          >
                            <BsFillEyeFill />{" "}
                          </button>
                          <button
                            onClick={() => deleteProduct(product._id)}
                            className="btn btn-danger"
                          >
                            <BsTrash3Fill />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </div>

          {/* pagination */}
          <div className="mt-3 pt-3 d-flex justify-content-center aligns-item-center">
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                <li className="page-item">
                  <Link
                    className="page-link text-1"
                    aria-label="Previous"
                    onClick={() => {
                      setPage((page) => {
                        if (page > 1) {
                          handelNextPrevious(page - 1);
                          return page - 1; // Corrected to return the updated value
                        } else {
                          return page; // If page is already 1, return the same value
                        }
                      });
                    }}
                  >
                    <span aria-hidden="true">&laquo;</span>
                    {/* <span className="sr-only">Previous</span> */}
                  </Link>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i} className="page-item">
                    <Link
                      className={`page-link text-1 ${
                        i + 1 <= page - 3 || i + 1 >= page + 3 ? "d-none" : ""
                      } 
                           
                          ${i + 1 === page ? "bg-3 text-1" : ""} `}
                      onClick={() => {
                        setPage(i + 1);
                        handlePageChange(i + 1);
                      }}
                    >
                      {i + 1}
                    </Link>
                  </li>
                ))}

                <Link
                  className="page-link text-1"
                  aria-label="Next"
                  onClick={() => {
                    setPage((page) => {
                      if (page < totalPages) {
                        handelNextPrevious(page + 1);
                        return page + 1; // Corrected to return the updated value
                      } else {
                        return page; // If page is already 1, return the same value
                      }
                    });
                  }}
                >
                  {/* <span className="sr-only">Next</span> */}
                  <span aria-hidden="true">&raquo;</span>
                </Link>
              </ul>
            </nav>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AllProduct;
