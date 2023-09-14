import axios from "axios";
import React, { useState, useEffect, useReducer } from "react";
import Product from "../../components/productCard/Product";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
// import { initialUserState, userReducer } from "../../context/userContext";

function Home() {
  const [allproducts, setAllProducts] = useState([]);

  // const [state] = useReducer(userReducer, initialUserState);

  const navigate = useNavigate();

  const getAllProducts = async (page = 1) => {
    try {
      const response = await axios.get(`/api/v1/product/allproducts/${page}`);
      console.log(response);
      setAllProducts(response.data.products);
    } catch (error) {
      console.log("something went wrong", error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);
  return (
    <>
      <Container fluid>
        <Row>
          <Col xs={2}>sidebar</Col>
          <Col className="pt-3 px-3" xs={10}>
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
