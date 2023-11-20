import React, { useEffect, useState } from "react";
import Product from "../productCard/Product";
// import Product from "../productCard/Product";

function Carousel(props) {
  // const [carouselItems, setCarouselItems] = useState([]);
  const [cardsPerSlide, setCardsPerSlide] = useState();

  useEffect(() => {
    setCardsPerSlide(props.cardsPerSlide);
  }, [props.cardsPerSlide]);

  // Create chunks of products for each slide w.r.t screen size
  // To make proper sliders and correct number of products
  const chunkedProducts = [];
  for (let i = 0; i < props.carouselItems.length; i += cardsPerSlide) {
    chunkedProducts.push(props.carouselItems.slice(i, i + cardsPerSlide));
  }

  return (
    <>
      <div className="container my-5">
        <div
          id="carouselExampleIndicators"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner mt-2">
            <h1 className="text-center">Featured Products</h1>
            {chunkedProducts.map((chunk, index) => {
              return (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <div className="d-flex justify-content-center">
                    {chunk.map((item, cardIndex) => {
                      return (
                        <Product key={item._id} product={item} />
                        // <div key={cardIndex} style={{ width: "18rem" }}>
                        // </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon bg-dark"
                aria-hidden="true"
              />
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon bg-dark"
                aria-hidden="true"
              />
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Carousel;
