import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Header from "./components/headerFooter/Header";
import Login from "./pages/login/Login";

import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import Signup from "./pages/signup/Signup";
import AddProduct from "./admin/addProduct/AddProduct";
import Dashboard from "./admin/dashboard/Dashboard";
import UserList from "./admin/userlist/UserList";
import AllProduct from "./admin/allproduct/AllProduct";
import AddCategory from "./admin/addCategory/AddCategory";
import Home from "./pages/home/Home";
import ProductDetails from "./pages/productDetails/ProductDetails";
import Cart from "./pages/cart/Cart";
import { useEffect, useState } from "react";
// import { initialUserState, userReducer } from "./reducer/userReducer";

import { useCart } from "./context/cartContext";
import { CheckOut } from "./pages/checkout/CheckOut";
import MyOrders from "./pages/myOrders/MyOrders";
import Loder from "./components/loder/Loder";

function App() {
  // const [state, dispatch] = useReducer(userReducer, initialUserState);
  // const token = localStorage.getItem("token");
  // const user = localStorage.getItem("user");
  const { cartState, cartDispatch } = useCart();

  const navigate = useNavigate();

  useEffect(() => {
    //get user cart from local storage
    const cart = JSON.parse(localStorage.getItem("cart"));
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (cart?.length > 0) {
      cartDispatch({ type: "LOAD_CART", payload: cart });
    }
    if (token && user) {
      cartDispatch({ type: "LOGIN_SUCCESS", payload: { token, user } });
    }
    //disable next line
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Header />

      <Routes>
        <Route path="/admin" element={<Admin />}>
          <Route path="" element={<Dashboard />}></Route>
          <Route path="add-product" element={<AddProduct />}></Route>
          <Route path="add-category" element={<AddCategory />}></Route>
          <Route path="all-product" element={<AllProduct />}></Route>
          <Route path="user-list" element={<UserList />}></Route>
          <Route path="inventory" element={<Dashboard />}></Route>
        </Route>
        <Route path="/user" element={<User />}>
          <Route path="" element={<Home />}></Route>
          {/* <Route path="profile" element={<Profile />}></Route> */}
          <Route path="cart" element={<Cart />}></Route>
          <Route path="checkout" element={<CheckOut />}></Route>
          <Route path="myorders" element={<MyOrders />}></Route>
        </Route>
        <Route path="/" element={<Home />}></Route>

        <Route
          path="/product-details/:productId"
          element={<ProductDetails />}
        ></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
      </Routes>
    </>
  );
}

function Admin() {
  const { cartState, cartDispatch } = useCart();
  const [isAdmin, setIsAdmin] = useState();
  useEffect(() => {
    setIsAdmin(cartState.user.isAdmin);
  }, [cartState?.token]);
  return isAdmin ? <Outlet /> : <Loder />;
}

function User() {
  const { cartState, cartDispatch } = useCart();
  const [isUser, setIsUser] = useState();

  useEffect(() => {
    setIsUser(cartState.user.role);
  }, [cartState.user, cartState.token]);
  return isUser === 0 ? <Outlet /> : <Loder />;
}
export default App;
