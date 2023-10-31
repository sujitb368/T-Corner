import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Dashboard.css";
import Itemcard from "../component/itemcard/Itemcard";
import Sidebar from "../component/sidebar/Sidebar";
import { BsXSquareFill } from "react-icons/bs";
function Dashboard() {
  const [toggleSideBar, setToggleSideBar] = useState(false);

  const handelSideBar = () => {
    setToggleSideBar(!toggleSideBar);
  };
  return (
    <>
      <Container className="" fluid>
        <Row>
          <Col
            xs={8}
            md={2}
            className={`side-bar pt-5 side-bar-responsive bg-2 ${
              toggleSideBar ? "side-bar-responsive-toggle" : ""
            }`}
          >
            <Sidebar />
          </Col>
          <Col className={`bg-4 pt-4 `} xs={window.innerWidth <= 830 ? 12 : 10}>
            <div className="d-md-none d-flex justify-content-end">
              {!toggleSideBar ? (
                <button className="btn bg-3" onClick={handelSideBar}>
                  Sidebar
                </button>
              ) : (
                <button className="btn bg-3" onClick={handelSideBar}>
                  <BsXSquareFill />
                </button>
              )}
            </div>
            <h4 className="text-2">Dashboard</h4>

            <Row className="px-2">
              <Itemcard valueOfCard="500" titleOfCard="Total user" />
              <Itemcard valueOfCard="100" titleOfCard="New Order" />
              <Itemcard valueOfCard="500" titleOfCard="Active user" />
              <Itemcard valueOfCard="100" titleOfCard="Shipped Order" />

              <span className="bg-1" onClick={handelSideBar}>
                icon
              </span>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
