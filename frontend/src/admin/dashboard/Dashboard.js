import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Dashboard.css";
import Itemcard from "../component/itemcard/Itemcard";
import Sidebar from "../component/sidebar/Sidebar";
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
            xs={window.innerWidth <= 530 ? 6 : window.innerWidth <= 830 ? 4 : 2}
            className={`side-bar pt-5 side-bar-responsive bg-2 ${
              toggleSideBar ? "side-bar-responsive-toggle" : ""
            }`}
          >
            <Sidebar />
          </Col>
          <Col className={`bg-4 pt-4 `} xs={window.innerWidth <= 830 ? 12 : 10}>
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
