import axios from "axios";
import React, { useState, useEffect } from "react";
import Product from "../../components/productCard/Product";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Message from "../../components/message/Message.js";
import { useCart } from "../../context/cartContext";
import Filters from "../../components/filters/Filters";
import HomeCover from "./HomeCover.js";
import Carousel from "../../components/carousel/Carousel.js";
// import { initialUserState, userReducer } from "../../context/userContext";

import "./Home.css";

/**
 * Home component for displaying and filtering products.
 */
function Home() {
  // Cart context
  const { cartState, cartDispatch } = useCart();

  // State variables
  const [allproducts, setAllProducts] = useState([
    {
      id: 1,
      name: "Potato",
      description: "Versatile starchy tuber widely used in Indian cuisine.",
      price: 20,
      image: "https://source.unsplash.com/800x600/?potato",
    },
    {
      id: 2,
      name: "Tomato",
      description:
        "Juicy and tangy fruit commonly used as a vegetable in Indian cooking.",
      price: 30,
      image: "https://source.unsplash.com/800x600/?tomato",
    },
    {
      id: 3,
      name: "Spinach",
      description: "Leafy green vegetable rich in iron and vitamins.",
      price: 25,
      image: "https://source.unsplash.com/800x600/?spinach",
    },
    {
      id: 4,
      name: "Cauliflower",
      description:
        "Cruciferous vegetable with a mild flavor, often used in curries.",
      price: 40,
      image: "https://source.unsplash.com/800x600/?cauliflower",
    },
    {
      id: 5,
      name: "Okra (Bhindi)",
      description:
        "Green, slender vegetable with a unique texture, used in various Indian dishes.",
      price: 35,
      image: "https://source.unsplash.com/800x600/?okra",
    },
    {
      id: 6,
      name: "Eggplant (Brinjal)",
      description:
        "Purple or green vegetable with a meaty texture, popular in Indian curries.",
      price: 45,
      image: "https://source.unsplash.com/800x600/?eggplant",
    },
    {
      id: 7,
      name: "Carrot",
      description:
        "Sweet and crunchy root vegetable, commonly used in salads and gravies.",
      price: 28,
      image: "https://source.unsplash.com/800x600/?carrot",
    },
    {
      id: 8,
      name: "Cabbage",
      description:
        "Leafy green or purple vegetable used in various Indian dishes.",
      price: 30,
      image: "https://source.unsplash.com/800x600/?cabbage",
    },
    {
      id: 9,
      name: "Bell Pepper (Capsicum)",
      description:
        "Colorful and sweet vegetable used in salads, stir-fries, and curries.",
      price: 50,
      image: "https://source.unsplash.com/800x600/?bell-pepper",
    },
    {
      id: 10,
      name: "Onion",
      description:
        "Pungent bulb vegetable used as a base in many Indian dishes.",
      price: 15,
      image: "https://source.unsplash.com/800x600/?onion",
    },
  ]);
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

  // Location hook to get query parameters from URL
  let location = useLocation();

  // to filter product based on category
  const queryParams = decodeURIComponent(location?.search?.split("=")[1]);

  // Navigation hook
  const navigate = useNavigate();

  /**
   * Handler for applying filters.
   * @param {Array} category - Selected category for filtering.
   * @param {Array} price - Selected price range for filtering.
   */
  const handelFilter = (category, price) => {
    if (category) {
      setCategoryToFilter(category);
    }
    if (price) {
      setPriceToFilter(price);
    }
  };

  /**
   * Reset filters.
   * @param {Boolean} reset - Flag to reset filters.
   */
  const reset = (reset) => {
    setCategoryToFilter([]);
    setPriceToFilter([]);

    cartDispatch({ type: "SEARCH", payload: "all" });

    getAllProducts();
  };

  /**
   * Handle page change.
   * @param {Number} pageNumber - Selected page number.
   */
  const handlePageChange = (pageNumber) => {
    if (productFrom === "all") {
      getAllProducts(pageNumber);
    } else if (productFrom === "filter") {
      getFilteredProducts();
    } else if (productFrom === "search") {
      getSearchProducts();
    }
  };

  /**
   * Handle next/previous page navigation.
   * @param {Number} currentPage - Current page number.
   */
  const handelNextPrevious = async (currentPage) => {
    if (productFrom === "all") {
      getAllProducts(currentPage);
    } else if (productFrom === "filter") {
      getFilteredProducts(currentPage);
    } else if (productFrom === "search") {
      getSearchProducts();
    }
  };

  /**
   * Get all products.
   * @param {Number} pageNumber - Page number for pagination.
   */
  const getAllProducts = async (pageNumber = 1) => {
    //only fo ecom-agri  return
    return;
    //eslint-disable-next-line
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

  /**
   * Get filtered products.
   * @param {Number} pageNumber - Page number for pagination.
   */
  const getFilteredProducts = async (pageNumber = 1) => {
    return;
    //eslint-disable-next-line
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
      }
    } catch (error) {
      Message({
        type: "error",
        message: error.response.data.message ?? "something went wrong",
      });
      console.error(error);
    }
  };

  /**
   * Get search products.
   */
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
    // making categoryToFilter and priceToFilter to empty on component rendering
    //if we do not make it empty it will load product from previous filter only
    // as we are setting this value in handelFilter function
    setCategoryToFilter([]);
    setPriceToFilter([]);

    if (!location.search) {
      getAllProducts();
    }

    //eslint-disable-next-line
  }, [location.search]);

  //this useEffect will trigger when we have filtered parameter i.e. priceToFilter and categoryToFilter
  useEffect(() => {
    if (
      queryParams !== undefined &&
      queryParams !== "undefined" &&
      queryParams?.length &&
      !categoryToFilter?.length
    ) {
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
          <Col
            xs={2}
            className={`d-none d-md-block side-bar pt-5 side-bar-responsive-user`}
          >
            <Filters reset={reset} onClick={handelFilter} />
          </Col>
          <Col className="p-0 m-0" xs={12} md={10}>
            <HomeCover />
            <Carousel
              carouselItems={allproducts}
              cardsPerSlide={
                window.innerWidth < 764 ? 1 : window.innerWidth <= 1000 ? 2 : 5
              }
            />
            {!allproducts.length && (
              <h6 className="text-2 px-3 py-5">
                No product found for selected filter
              </h6>
            )}
            <Row className="px-3 mx-0">
              {allproducts &&
                allproducts?.map((product) => {
                  return (
                    <Product
                      key={product._id}
                      onClick={() => {
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
