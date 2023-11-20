import React from "react";
import { Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  BsFillPeopleFill,
  BsFillBagPlusFill,
  BsReverseLayoutTextSidebarReverse,
  BsGiftFill,
  BsFillCartPlusFill,
  BsHouseDoorFill,
} from "react-icons/bs";
import "./Sidebar.css";
function Sidebar() {
  // This component used to display side navigation buttons
  return (
    <aside className="aside">
      <Stack gap={2}>
        <Link
          to="/admin"
          className="bg-4 px-2 py-1 rounded text-decoration-none text-2"
        >
          <BsHouseDoorFill className="me-3 icon" />
          Home
        </Link>
        <Link
          to="/admin/add-category"
          className="bg-4 px-2 py-1 rounded text-decoration-none text-2"
        >
          <BsFillBagPlusFill className="me-3 icon" />
          Add Category
        </Link>

        <Link
          to="/admin/add-product"
          className="bg-4 px-2 py-1 rounded text-decoration-none text-2"
        >
          <BsFillCartPlusFill className="me-3 icon" /> Add Product
        </Link>
        <Link
          to="/admin/all-product"
          className="bg-4 px-2 py-1 rounded text-decoration-none text-2"
        >
          <BsReverseLayoutTextSidebarReverse className="me-3 icon" />
          All Product
        </Link>

        <Link
          to="/admin/orders"
          className="bg-4 px-2 py-1 rounded text-decoration-none text-2"
        >
          <BsGiftFill className="me-3 icon" />
          Orders
        </Link>
        <Link
          to="/admin/user-list"
          className="bg-4 px-2 py-1 rounded text-decoration-none text-2"
        >
          <BsFillPeopleFill className="me-3 icon" />
          User List
        </Link>
      </Stack>
    </aside>
  );
}

export default Sidebar;
