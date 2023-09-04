import React, { useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import Sidebar from "../component/sidebar/Sidebar";

function AllProduct() {
  const [toggleSideBar, setToggleSideBar] = useState(false);

  const handelSideBar = () => {
    setToggleSideBar(!toggleSideBar);
  };
  return (
    <Container fluid>
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
          <h6>All Products</h6>
          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Shipping</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                <td>@mdo</td>
                <td>@mdo</td>
                <td>@mdo</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default AllProduct;
