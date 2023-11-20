import React from "react";

import "./Footer.css";
const Footer = () => {
  return (
    <div
      style={{ height: "200px" }}
      className="container-fluid row bg-1 text-white  bottom-0 text-center m-0 mt-3"
    >
      <div className="col-md-3 my-3"></div>

      <div className="divider"></div>
      <p className="text-center py-2">Copyright &copy; T-Corner 2023</p>
    </div>
  );
};

export default Footer;
