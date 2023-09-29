import React, { useEffect } from "react";
import "./Product.css";

import { BsFillCartPlusFill } from "react-icons/bs";
import { Col } from "react-bootstrap";
import Rating from "../rating/Rating";
import { Link } from "react-router-dom";

function Product(props) {
  const { product } = props;

  return (
    <>
      <Col
        xs={window.innerWidth <= 540 ? 10 : window.innerWidth <= 840 ? 4 : 3}
      >
        <Link
          to={`product-details/${product._id}`}
          className="text-decoration-none"
        >
          <div className="card me-3 mt-3 text-center pt-1">
            {product.image ? (
              <img
                src={`http://localhost:8000/api/v1/files/get-file/${product.image}`}
                className="d-block card-img-top img-100"
                alt="product"
              />
            ) : (
              <img className="d-block card-img-top img-100" alt="product" />
            )}
            <div
              className="card-body d-flex flex-column"
              style={{ height: "300px" }}
            >
              <h5 className="card-title product-title">
                {product.name.split(" ").slice(0, 3).join(" ")}
              </h5>
              <h6 className="card-title product-price">₹ {product.price}</h6>
              <p className="card-text">
                {product.description.split(" ").slice(0, 10).join(" ")}
              </p>
              <Rating totalStar={product.averageRating?.toFixed(1)} />
            </div>
          </div>
        </Link>
      </Col>
    </>
  );
}

export default Product;
