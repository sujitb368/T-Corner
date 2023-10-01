import React, { useState } from "react";
import Message from "../message/Message.js";
function Filters({ Categories, Prices }) {
  // const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  //eslint-disable-next-line
  const [radio, setRadio] = useState([]);
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
      setChecked(all);
    } catch (error) {
      console.log("error in handelCheck", error);
      Message({ type: "error", message: "something went wrong" });
    }
  };
  return (
    <>
      <div className=" col-md-3 pt-3">
        <div className="d-flex flex-column">
          <h2 className="">Filter By Category</h2>

          {Categories.map((cat) => (
            <>
              <div key={cat._id}>
                <input
                  onChange={(e) => handelCheck(e.target.checked, cat._id)}
                  type="checkbox"
                />
                {cat.name}
              </div>
            </>
          ))}
        </div>

        <div className="d-flex flex-column">
          <h2 className="">Filter By Price</h2>
          {Prices.map((price) => (
            <>
              <div key={price.id}>
                <input
                  onChange={(e) => {
                    setRadio(e.target.checked);
                  }}
                  type="radio"
                  className="me-1"
                  name="filterPrice"
                />
                {price.price}
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}

export default Filters;
