import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Dashboard.css";
import Itemcard from "../component/itemcard/Itemcard";
import Sidebar from "../component/sidebar/Sidebar";
import { BsXSquareFill } from "react-icons/bs";
import Message from "../../components/message/Message.js";
import axios from "axios";

function Dashboard() {
  const [toggleSideBar, setToggleSideBar] = useState(false);

  const [totalUsers, setTotalUsers] = useState();

  const handelSideBar = () => {
    setToggleSideBar(!toggleSideBar);
  };

  const getTotalUsers = async () => {
    try {
      const { data } = await axios.get(`/user/total-users`);

      if (data?.success) {
        setTotalUsers(data.totalUsers);
        Message({ type: "success", message: data.message });
      }
    } catch (error) {
      Message({
        type: "error",
        message: error?.response?.data?.message ?? "Something went wrong",
      });
    }
  };

  useEffect(() => {
    getTotalUsers();
  }, []);
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
              <Itemcard valueOfCard={totalUsers} titleOfCard="Total user" />
              <Itemcard valueOfCard="100" titleOfCard="New Order" />
              <Itemcard valueOfCard="500" titleOfCard="Active user" />
              <Itemcard valueOfCard="100" titleOfCard="Shipped Order" />
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
