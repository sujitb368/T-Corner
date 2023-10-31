import React, { useEffect, useState } from "react";
import Message from "../message/Message.js";
import axios from "axios";
function Filters(props) {
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  //eslint-disable-next-line
  const [price, setPrice] = useState([]);

  const prices = [
    { price: [0, 500], label: "below 500", _id: "priceRange1" },
    { price: [500, 1000], label: "500 - 100", _id: "priceRange2" },
    { price: [1000, 1500], label: "1000 - 1500", _id: "priceRange3" },
    { price: [1500, 2000], label: "1500 - 2000", _id: "priceRange4" },
    { price: [2000, 0], label: "above 2000", _id: "priceRange5" },
  ];
  //handelCheck
  const handelCheck = (value, id) => {
    try {
      //get all checked categories

      let all = [...checked];
      if (value) {
        all.push(id);
      } else {
        all = all.filter((c) => c !== id);
      }
      console.log(all);

      setChecked(all);
    } catch (error) {
      console.log("error in handelCheck", error);
      Message({ type: "error", message: "something went wrong" });
    }
  };

  const handelPrice = (price) => {
    try {
      setPrice(price.split(","));
    } catch (error) {
      console.log(error);
    }
  };
  // function to get all categories
  const filter = () => {
    if (props?.onClick) {
      console.log("props onClick in filter");
      props.onClick(checked, price);
    }
  };
  const getAllCategories = async (event, id) => {
    try {
      console.log(event, id);
      const { data } = await axios.get(`/category/categories`);
      if (data.success) {
        setCategories(data.categories);
        console.log(data);
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
          <h6 className="text-center my-1">Filter By Category</h6>

          <>
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
          </>
        </div>

        <div className="d-flex flex-column">
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
        </div>

        <div className="text-center">
          <button onClick={filter} className="btn bg-3 text-1">
            Filter
          </button>
        </div>
      </div>
    </>
  );
}

export default Filters;
