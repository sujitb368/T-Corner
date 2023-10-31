import axios from "axios";
import React, { useState, useEffect } from "react";
import Product from "../../components/productCard/Product";
import { Col, Container, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Message from "../../components/message/Message.js";
import { useCart } from "../../context/cartContext";
import Filters from "../../components/filters/Filters";
// import { initialUserState, userReducer } from "../../context/userContext";

function Home() {
  const { cartState } = useCart();
  const [allproducts, setAllProducts] = useState([]);
  const [categoryToFilter, setCategoryToFilter] = useState([]);
  const [priceToFilter, setPriceToFilter] = useState([]);

  //get query parameters from url with useLocation hook
  let location = useLocation();

  // to filter product based on category
  const queryParams = location.search.split("=")[1]?.join();

  console.log("Query parameters", queryParams);

  const navigate = useNavigate();

  const handelFilter = (category, price) => {
    if (category) {
      setCategoryToFilter(category);
    }
    if (price) {
      setPriceToFilter(price);
    }
  };

  const getAllProducts = async (page = 1) => {
    try {
      Message({ type: "success", message: "getting all product" });
      const response = await axios.get(`/product/allproducts/${page}`);

      setAllProducts(response.data.products);
    } catch (error) {
      console.log("something went wrong", error);
      Message({ type: "error", message: error.response.data.message });
    }
  };

  const getFilteredProducts = async () => {
    try {
      const { data } = await axios.post(
        `/product/filter`,
        { category: categoryToFilter, price: priceToFilter },
        {
          "content-type": "Application/json",
          authorization: "Bearer " + cartState.token,
        }
      );
      setAllProducts(data.products);
      Message({
        type: data.products.length ? "success" : "no product",
        message: data.message,
      });
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
  }, [location.search]);

  useEffect(() => {
    if (
      queryParams?.length ||
      categoryToFilter?.length ||
      priceToFilter?.length
    ) {
      console.log(
        "location.search",

        queryParams,
        categoryToFilter
      );
      setCategoryToFilter(queryParams);
      getFilteredProducts();
    }
    //eslint-disable-next-line
  }, [queryParams, categoryToFilter, priceToFilter]);

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
                      onClick={() => {
                        console.log("product._id", product._id);
                        navigate(`/product-details/${product._id}`);
                      }}
                      key={product._id}
                      product={product}
                    />
                  );
                })}
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Home;
