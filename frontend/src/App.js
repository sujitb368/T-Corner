import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Header from "./components/headerFooter/Header";
import Login from "./pages/login/Login";

import { Route, Routes } from "react-router-dom";
import Signup from "./pages/signup/Signup";
import AddProduct from "./admin/addProduct/AddProduct";
import Dashboard from "./admin/dashboard/Dashboard";
import UserList from "./admin/userlist/UserList";
import AllProduct from "./admin/allproduct/AllProduct";
import AddCategory from "./admin/addCategory/AddCategory";
import Home from "./pages/home/Home";
import ProductDetails from "./pages/productDetails/ProductDetails";
import Cart from "./pages/cart/Cart";
import { useEffect, useReducer } from "react";
// import { initialUserState, userReducer } from "./reducer/userReducer";

import { useNavigate } from "react-router-dom";
import { useCart } from "./context/cartContext";
import { CheckOut } from "./pages/checkout/CheckOut";

function App() {
  // const [state, dispatch] = useReducer(userReducer, initialUserState);
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
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
  }, []);

  return (
    <>
      <Header />

      <Routes>
        <Route path="/admin">
          <Route path="dashboard" element={<Dashboard />}></Route>
          <Route path="add-product" element={<AddProduct />}></Route>
          <Route path="add-category" element={<AddCategory />}></Route>
          <Route path="all-product" element={<AllProduct />}></Route>
          <Route path="user-list" element={<UserList />}></Route>
          <Route path="inventory" element={<Dashboard />}></Route>
        </Route>
        <Route path="/" element={<Home />}></Route>
        <Route
          path="/product-details/:productId"
          element={<ProductDetails />}
        ></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/checkout" element={<CheckOut />}></Route>
      </Routes>
    </>
  );
}

export default App;
