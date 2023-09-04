import React, { useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import Sidebar from "../component/sidebar/Sidebar";

function UserList() {
  const [toggleSideBar, setToggleSideBar] = useState(false);

  const handelSideBar = () => {
    setToggleSideBar(!toggleSideBar);
  };
  return (
    <>
      <Container className="" fluid>
        <Row>
          <Col
            xs={2}
            className={`side-bar pt-5 side-bar-responsive bg-2${
              toggleSideBar ? "side-bar-responsive-toggle" : ""
            }`}
          >
            <Sidebar />
          </Col>
          <Col className={`bg-4 pt-4 `} xs={window.innerWidth <= 830 ? 12 : 10}>
            <h4 className="text-2">Dashboard</h4>
            <hr className="my-2" />
            <h6>All Users</h6>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default UserList;
