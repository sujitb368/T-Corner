import React from "react";
import { Row, Col, Stack, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  BsFillGridFill,
  BsFillPeopleFill,
  BsFillBagPlusFill,
} from "react-icons/bs";
import "./Sidebar.css";
function Sidebar() {
  return (
    <aside className="aside">
      <Stack gap={2}>
        <Link
          to="/admin/user-list"
          className="bg-4 px-2 py-1 rounded text-decoration-none text-2"
        >
          <BsFillPeopleFill className="me-3 icon" />
          User List
        </Link>
        <Link
          to="/admin/add-product"
          className="bg-4 px-2 py-1 rounded text-decoration-none text-2"
        >
          <BsFillBagPlusFill className="me-3 icon" /> Add Product
        </Link>
        <Link
          to="/admin/all-product"
          className="bg-4 px-2 py-1 rounded text-decoration-none text-2"
        >
          <BsFillBagPlusFill className="me-3 icon" />
          All Product
        </Link>
        <Link
          to="/admin/add-category"
          className="bg-4 px-2 py-1 rounded text-decoration-none text-2"
        >
          <BsFillBagPlusFill className="me-3 icon" />
          Add Category
        </Link>
        {/* <Link
          to="/admin/inventory"
          className="bg-4 px-2 py-1 rounded text-decoration-none text-2"
        >
          <BsFillBagPlusFill className="me-3 icon" /> Inventory
        </Link> */}
      </Stack>
    </aside>
  );
}

export default Sidebar;
