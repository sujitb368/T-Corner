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

function App() {
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
        <Route path="/home" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
      </Routes>
    </>
  );
}

export default App;
