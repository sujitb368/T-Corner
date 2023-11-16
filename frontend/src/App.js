/**
 * Main application component.
 *
 * This component serves as the entry point for this React application.
 * It includes the necessary routes and components for both the admin and user interfaces.
 * The component also handles the initialization of the shopping cart and user authentication.
 *
 * @component
 * @returns {JSX.Element} - The main application component.
 */

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Header from "./components/headerFooter/Header";
import Login from "./pages/login/Login";

import { Outlet, Route, Routes } from "react-router-dom";
import Signup from "./pages/signup/Signup";
import AddProduct from "./admin/addProduct/AddProduct";
import Dashboard from "./admin/dashboard/Dashboard";
import UserList from "./admin/userlist/UserList";
import AllProduct from "./admin/allproduct/AllProduct";
import AddCategory from "./admin/addCategory/AddCategory";
import Orders from "./admin/orders/Orders";
import Home from "./pages/home/Home";
import ProductDetails from "./pages/productDetails/ProductDetails";
import Cart from "./pages/cart/Cart";
import { useEffect, useState } from "react";
// import { initialUserState, userReducer } from "./reducer/userReducer";

import { useCart } from "./context/cartContext";
import { CheckOut } from "./pages/checkout/CheckOut";
import MyOrders from "./pages/myOrders/MyOrders";
import Loder from "./components/loder/Loder";
import Profile from "./pages/profile/Profile";
import axios from "axios";
import ReviewOrder from "./pages/reviewOrder/ReviewOrder";
import OrderDetails from "./pages/orderDetails/OrderDetails";
import EditAndViewProduct from "./admin/editAndViewProduct/EditAndViewProduct";
import ResetPassword from "./pages/resetPassword/ResetPassword";

function App() {
  const { cartState, cartDispatch } = useCart();

  //hosted backend
  // axios.defaults.baseURL = "https://t-corner.onrender.com/api/v1";

  //local backend
  axios.defaults.baseURL = "http://localhost:8000/api/v1";

  useEffect(() => {
    //get user cart from local storage
    const cart = JSON.parse(localStorage.getItem("cart"));
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    // Load cart if it exists
    if (cart?.length > 0) {
      cartDispatch({ type: "LOAD_CART", payload: cart });
    }
    // Log in user if token and user exist
    if (token && user) {
      cartDispatch({ type: "LOGIN_SUCCESS", payload: { token, user } });
    }
    //disable next line
    // eslint-disable-next-line
  }, []);

  /**
   * Routing logic for the application.
   *
   * This section defines the routing structure using React Router for both the admin and user interfaces.
   * It includes routes for various pages, such as the dashboard, product management, user orders, and profile.
   * The routing logic dynamically determines whether to render the admin or user interface based on the user's role.
   * Additionally, loading indicators are displayed during role validation.
   *
   * @component
   * @returns {JSX.Element} - The JSX element containing the application's routing logic.
   */

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
          <Route path="orders" element={<Orders />}></Route>
          <Route
            path="view-product/:productId"
            element={<EditAndViewProduct />}
          ></Route>
          <Route
            path="product-details/:productId"
            element={<ProductDetails />}
          ></Route>
          <Route path="profile" element={<Profile />}></Route>
        </Route>
        <Route path="/user" element={<User />}>
          <Route path="" element={<Home />}></Route>
          {/* <Route path="profile" element={<Profile />}></Route> */}
          <Route path="cart" element={<Cart />}></Route>
          <Route path="checkout" element={<CheckOut />}></Route>
          <Route path="myorders" element={<MyOrders />}></Route>
          <Route path="myorders/:orderId" element={<OrderDetails />}></Route>
          <Route path="profile" element={<Profile />}></Route>
          <Route path="reviewOrder" element={<ReviewOrder />}></Route>
        </Route>
        <Route
          path="/"
          element={cartState.user.isAdmin ? <Dashboard /> : <Home />}
        ></Route>

        <Route
          path="/product-details/:productId"
          element={<ProductDetails />}
        ></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        ></Route>
      </Routes>
    </>
  );
}

/**
 * The Admin function checks if the user is an admin and renders the Outlet component if true,
 * otherwise it renders the Loader component.
 * @returns either the `<Outlet />` component or the `<Loader />` component, depending on the value of
 * the `isAdmin` state variable.
 */
function Admin() {
  const { cartState } = useCart();
  const [isAdmin, setIsAdmin] = useState();
  // const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    setIsAdmin(cartState.user.isAdmin);
  }, [cartState.user.isAdmin]);
  return isAdmin ? <Outlet /> : <Loder />;
}

/**
 * The function checks the role of the user in the cart state and renders different components based on
 * the user's role.
 * @returns The code is returning either the `<Outlet />` component or the `<Loader />` component based
 * on the value of the `isUser` variable. If `isUser` is equal to 0, then `<Outlet />` is returned.
 * Otherwise, `<Loader />` is returned.
 */
function User() {
  const { cartState } = useCart();
  const [isUser, setIsUser] = useState();

  useEffect(() => {
    setIsUser(cartState.user.role);
  }, [cartState.user, cartState.token]);
  return isUser === 0 ? <Outlet /> : <Loder />;
}
export default App;
