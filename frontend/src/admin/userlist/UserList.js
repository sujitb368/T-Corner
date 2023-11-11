import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import Sidebar from "../component/sidebar/Sidebar";
import { BsXSquareFill } from "react-icons/bs";
import Message from "../../components/message/Message";
import axios from "axios";
import { useCart } from "../../context/cartContext";
import { Link } from "react-router-dom";

function UserList() {
  //getting state from global context
  const { cartState } = useCart();

  const [toggleSideBar, setToggleSideBar] = useState(false);

  const [allUsers, setAllUsers] = useState([]);

  const [totalPages, setTotalPages] = useState(5);

  //page for search results
  const [page, setPage] = useState(1);

  const getAllUsers = async (currentPage = 1) => {
    try {
      const { data } = await axios.get(`/user/all-users/${currentPage}`, {
        headers: {
          Authorization: cartState.token,
        },
      });
      if (data.success) {
        setAllUsers(data.users);
        setTotalPages(data.totalPage);
        setPage(data.currentPage);
        if (!data.users.length) {
          Message({
            type: "success",
            message: "No more user found",
          });
        }
      }
    } catch (error) {
      Message({
        type: "error",
        message: error?.response?.data?.message ?? "Something went wrong",
      });
    }
  };
  const getSearchedUser = async (currentPage = 1) => {
    try {
      const { data } = await axios.get(
        `/user/search-users?query=${cartState.searchQuery}&page=${currentPage}`,
        {
          headers: {
            Authorization: cartState.token,
          },
        }
      );
      if (data.success) {
        console.log("users", data.users);
        setAllUsers(data.users);
        setTotalPages(data.totalPage);
        setPage(data.currentPage);
        if (!data.users.length) {
          Message({
            type: "success",
            message: "No more user found",
          });
        }
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

  const handlePageChange = (currentPage) => {
    getAllUsers(currentPage);
  };

  const handelNextPrevious = async (currentPage) => {
    getAllUsers(currentPage);
  };

  useEffect(() => {
    getAllUsers();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (cartState.searchQuery !== "all" && cartState.searchQuery.length > 1) {
      getSearchedUser();
    }
    if (cartState.searchQuery === "all") {
      getAllUsers();
    }
    //eslint-disable-next-line
  }, [cartState.searchQuery]);

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
                        <tr key={user._id}>
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

            <div className="mt-3 pt-3 d-flex justify-content-center aligns-item-center">
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  <li className="page-item">
                    <Link
                      className="page-link text-1"
                      aria-label="Previous"
                      onClick={() => {
                        setPage((page) => {
                          if (page > 1) {
                            handelNextPrevious(page - 1);
                            return page - 1; // Corrected to return the updated value
                          } else {
                            return page; // If page is already 1, return the same value
                          }
                        });
                      }}
                    >
                      <span aria-hidden="true">&laquo;</span>
                      {/* <span className="sr-only">Previous</span> */}
                    </Link>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={"list" + i} className="page-item">
                      <Link
                        key={i}
                        className={`page-link text-1 ${
                          i + 1 <= page - 3 || i + 1 >= page + 3 ? "d-none" : ""
                        } 
                           
                          ${i + 1 === page ? "bg-3 text-1" : ""} `}
                        onClick={() => {
                          setPage(i + 1);
                          handlePageChange(i + 1);
                        }}
                      >
                        {i + 1}
                      </Link>
                    </li>
                  ))}

                  <Link
                    className="page-link text-1"
                    aria-label="Next"
                    onClick={() => {
                      setPage((page) => {
                        if (page < totalPages) {
                          handelNextPrevious(page + 1);
                          return page + 1; // Corrected to return the updated value
                        } else {
                          return page; // If page is already 1, return the same value
                        }
                      });
                    }}
                  >
                    {/* <span className="sr-only">Next</span> */}
                    <span aria-hidden="true">&raquo;</span>
                  </Link>
                </ul>
              </nav>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default UserList;
