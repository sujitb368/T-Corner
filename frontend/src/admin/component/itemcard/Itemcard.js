import React from "react";
import { Card, Col, Row } from "react-bootstrap";

function Itemcard(props) {
  // This component used to display data on dashboard
  return (
    <>
      <Col
        xs={window.innerWidth <= 540 ? 10 : window.innerWidth <= 840 ? 4 : 3}
      >
        <Card className={` mt-3 me-1`}>
          <Card.Body>
            <Row>
              <Col xs={9}>
                <p>{props.titleOfCard}</p>
              </Col>
              <Col xs={3} className="d-flex justify-content-end">
                <span>...</span>
              </Col>
            </Row>
            <Row>
              <p>{props.valueOfCard}</p>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export default Itemcard;
