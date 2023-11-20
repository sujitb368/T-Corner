import React from "react";
import "./HomeCover.css";
/* is importing an image file named "logo1.png" from
the "./images" directory*/
import logo from "../../images/logo1.png";

/**
 * HomeCover component for displaying a banner with a logo and text.
 */
function HomeCover() {
  return (
    <>
      <div className="container-fluid p-0 m-0">
        {/*  add image as background  */}
        <div className="banner px-3 text-center">
          <h1>
            <img src={logo} alt="logo" />
          </h1>
          {/* banner text */}
          <p className="fs-3"> Ultimate T-shirt destination at T-Corner </p>
        </div>
      </div>
    </>
  );
}
export default HomeCover;
