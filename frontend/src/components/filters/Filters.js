import React, { useEffect, useState } from "react";
import Message from "../message/Message.js";
import axios from "axios";

/**
 * Filters component for filtering products by category and price range.
 * @param {Object} props - Component properties.
 * @param {Function} props.onClick - Callback function triggered on filter application.
 * @param {Function} props.reset - Callback function triggered on filter reset.
 */
function Filters(props) {
  // State to hold categories, checked checkboxes, and price range
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  //eslint-disable-next-line
  const [price, setPrice] = useState([]);

  // Array of predefined price ranges
  const prices = [
    { price: [0, 500], label: "below 500", _id: "priceRange1" },
    { price: [500, 1000], label: "500 - 1000", _id: "priceRange2" },
    { price: [1000, 1500], label: "1000 - 1500", _id: "priceRange3" },
    { price: [1500, 2000], label: "1500 - 2000", _id: "priceRange4" },
    { price: [2000, 0], label: "above 2000", _id: "priceRange5" },
  ];

  /**
   * Handle checkbox state changes.
   * @param {boolean} value - Checkbox checked status.
   * @param {string} id - Category ID.
   */
  const handelCheck = (value, id) => {
    try {
      //get all checked categories
      let all = [...checked];
      if (value) {
        all.push(id);
      } else {
        all = all.filter((c) => c !== id);
      }
      setChecked(all);
    } catch (error) {
      console.log("Error in handelCheck", error);
      Message({ type: "error", message: "something went wrong" });
    }
  };

  /**
   * Handle radio button changes for price range.
   * @param {string} price - Selected price range.
   */
  const handelPrice = (price) => {
    try {
      setPrice(price.split(","));
    } catch (error) {
      console.log(error);
    }
  };
  //Trigger filter application by invoking the parent component's onClick callback.
  // function to get all categories
  const filter = () => {
    if (props?.onClick) {
      props.onClick(checked, price);
    }
  };

  //  Trigger filter reset by invoking the parent component's reset callback.
  const reset = () => {
    if (props?.reset) {
      props.reset();
    }
  };

  /**
   * Fetch all categories from the server.
   */
  const getAllCategories = async (event, id) => {
    try {
      const { data } = await axios.get(`/category/categories`);
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.log(error);
      Message({
        type: "error",
        message: error.response?.data?.message ?? "Something went wrong",
      });
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);
  return (
    <>
      <div className="pt-3">
        <div className="d-flex flex-column">
          <h6 className="text-center my-1">Side Bar</h6>

          {/* <>
            {categories.map((cat) => (
              <div className="d-flex align-items-center" key={cat._id}>
                <input
                  onChange={(e) => handelCheck(e.target.checked, cat.category)}
                  type="checkbox"
                  className="form-check-input"
                />

                <span className="ms-1">{cat.category}</span>
              </div>
            ))}
          </> */}
        </div>

        {/* <div className="d-flex flex-column">
          <h6 className="text-center my-1">Filter By Price</h6>
          <>
            {prices.map((price) => (
              <div key={price._id}>
                <input
                  onChange={(e) => handelPrice(e.target.value)}
                  value={price.price}
                  type="radio"
                  className="form-check-input"
                  name="filterPrice"
                />

                <span className="ms-1">{price.label}</span>
              </div>
            ))}
          </>
        </div> */}

        {/* <div className="text-center mt-1">
          <button onClick={filter} className="btn bg-3 text-1 me-1 mb-1">
            Filter
          </button>
          <button onClick={(e) => reset()} className="btn bg-3 text-1 mb-1">
            Reset
          </button>
        </div> */}
      </div>
    </>
  );
}

export default Filters;
