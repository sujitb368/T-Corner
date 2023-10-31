import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import Sidebar from "../component/sidebar/Sidebar";
import { BsXSquareFill } from "react-icons/bs";
import Message from "../../components/message/Message";
import axios from "axios";
import { useCart } from "../../context/cartContext";

function UserList() {
  //getting state from global context
  const { cartState } = useCart();

  const [toggleSideBar, setToggleSideBar] = useState(false);

  const [allUsers, setAllUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const { data } = await axios.get(`/user/all-users`, {
        headers: {
          Authorization: cartState.token,
        },
      });
      if (data.success) {
        console.log("users", data.users);
        setAllUsers(data.users);
      }
    } catch (error) {
      Message({
        type: "error",
        message: error?.response?.data?.message ?? "Something went wrong",
      });
    }
  };

  const deleteUser = async (userId) => {
    try {
      const { data } = await axios.delete(`/user/delete-user/${userId}`, {
        headers: {
          Authorization: cartState.token,
        },
      });
      if (data.success) {
        Message({
          type: "success",
          message: data?.message,
        });
        getAllUsers();
      }
    } catch (error) {
      console.log(error);
      Message({
        type: "error",
        message: error?.response?.data?.message ?? "Something went wrong",
      });
    }
  };
  const handelSideBar = () => {
    setToggleSideBar(!toggleSideBar);
  };

  useEffect(() => {
    getAllUsers();
    // eslint-disable-next-line
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
            <hr className="my-2" />
            <h6>All Users</h6>
            <div className="table-responsive">
              <Table bordered hover size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>User Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.length > 0 &&
                    allUsers.map((user, index) => {
                      return (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                          <td>{user.isAdmin ? "Admin" : "Customer/User"}</td>
                          <td>
                            <button
                              className="btn btn-danger"
                              onClick={() => deleteUser(user._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default UserList;
