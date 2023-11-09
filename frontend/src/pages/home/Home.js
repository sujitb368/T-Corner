import axios from "axios";
import React, { useState, useEffect } from "react";
import Product from "../../components/productCard/Product";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Message from "../../components/message/Message.js";
import { useCart } from "../../context/cartContext";
import Filters from "../../components/filters/Filters";
// import { initialUserState, userReducer } from "../../context/userContext";

function Home() {
  const { cartState } = useCart();
  const [allproducts, setAllProducts] = useState([]);
  const [categoryToFilter, setCategoryToFilter] = useState([]);
  const [priceToFilter, setPriceToFilter] = useState([]);

  //result on per page
  //eslint-disable-next-line
  const [perPage, setPerPage] = useState(10);

  const [totalPages, setTotalPages] = useState(5);

  //page for search results
  const [page, setPage] = useState(1);

  // get product from
  const [productFrom, setProductFrom] = useState("all");

  //get query parameters from url with useLocation hook
  let location = useLocation();

  // to filter product based on category
  const queryParams = location.search.split("=")[1]?.join();

  const navigate = useNavigate();

  const handelFilter = (category, price) => {
    if (category) {
      console.log("handel filter in home", category);
      setCategoryToFilter(category);
    }
    if (price) {
      setPriceToFilter(price);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (productFrom === "all") {
      getAllProducts(pageNumber);
    } else if (productFrom === "filter") {
      getFilteredProducts();
    } else if (productFrom === "search") {
      getSearchProducts();
    }
  };

  const handelNextPrevious = async (currentPage) => {
    if (productFrom === "all") {
      getAllProducts(currentPage);
    } else if (productFrom === "filter") {
      getFilteredProducts(currentPage);
    } else if (productFrom === "search") {
      getSearchProducts();
    }
  };

  const getAllProducts = async (pageNumber = 1) => {
    try {
      const { data } = await axios.get(`/product/allproducts/${pageNumber}`);

      if (data?.success) {
        setAllProducts(data.products);
        setTotalPages(data.totalPage);
        setPage(data.currentPage);
        Message({ type: "success", message: "All products" });
      }
    } catch (error) {
      console.log("something went wrong", error);
      Message({ type: "error", message: error.response.data.message });
    }
  };

  const getFilteredProducts = async (pageNumber = 1) => {
    try {
      const { data } = await axios.post(
        `/product/filter/${pageNumber}`,
        { category: categoryToFilter, price: priceToFilter },
        {
          "content-type": "Application/json",
          authorization: "Bearer " + cartState.token,
        }
      );

      if (data?.success) {
        setAllProducts(data.products);
        setTotalPages(data.totalPage);
        setPage(data.currentPage);
        setProductFrom("filter");
        Message({
          type: data.products.length ? "success" : "No product found",
          message: data.message,
        });
        console.log("category to filter", categoryToFilter);
        console.log("price to filter", priceToFilter);
      }
    } catch (error) {
      Message({
        type: "error",
        message: error.response.data.message ?? "something went wrong",
      });
      console.error(error);
    }
  };

  const getSearchProducts = async () => {
    try {
      const { data } = await axios.get(
        `/product/search?query=${cartState.searchQuery}&page=${page}&perPage=${perPage}`
      );

      if (data?.success) {
        setAllProducts(data.products);
        setTotalPages(data.totalPage);
        setPage(data.currentPage);
        setProductFrom("search");
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

  useEffect(() => {
    if (!location.search) {
      getAllProducts();
    }
    //eslint-disable-next-line
  }, [location.search]);

  //this useEffect will trigger when we have filtered parameter i.e. priceToFilter and categoryToFilter
  useEffect(() => {
    if (queryParams?.length) {
      //when we have query params to filter
      setCategoryToFilter(queryParams);
      getFilteredProducts();
    }

    if (categoryToFilter?.length || priceToFilter?.length) {
      // if categoryToFilter && priceToFilter
      getFilteredProducts();
    }
    //eslint-disable-next-line
  }, [queryParams, categoryToFilter, priceToFilter]);

  useEffect(() => {
    if (cartState.searchQuery !== "all") {
      getSearchProducts();
    }
    //eslint-disable-next-line
  }, [cartState.searchQuery]);

  return (
    <>
      <Container fluid>
        <Row>
          <Col xs={2} className={`side-bar pt-5 side-bar-responsive`}>
            <Filters onClick={handelFilter} />
          </Col>
          <Col className="px-3 py-5" xs={10}>
            {!allproducts.length && (
              <h6 className="text-2 px-3 py-5">
                No product found for selected filter
              </h6>
            )}
            <Row>
              {allproducts &&
                allproducts?.map((product) => {
                  return (
                    <Product
                      key={product._id}
                      onClick={() => {
                        console.log("product._id", product._id);
                        navigate(`/product-details/${product._id}`);
                      }}
                      product={product}
                    />
                  );
                })}

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
                      <li key={"paginationKey" + i} className="page-item">
                        <Link
                          className={`page-link text-1 ${
                            i + 1 <= page - 3 || i + 1 >= page + 3
                              ? "d-none"
                              : ""
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
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Home;
