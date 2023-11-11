import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { useCart } from "./context/cartContext";
import Loder from "./components/loder/Loder";

function ProtectedRoutes() {
  const [ok, setOk] = useState(false);
  const { cartState } = useCart();

  useEffect(() => {
    const authCheck = async () => {
      const res = await axios.get(`/user/isLoggedIn`, {
        headers: {
          Authorization: cartState.token,
        },
      });
      if (res?.data?.loggedIn) {
        setOk(true);
      } else {
        setOk(false);
      }
    };
    if (cartState?.token) {
      authCheck();
    }
    //eslint-disable-next-line
  }, []);
  return ok ? <Outlet /> : <Loder />;
}

export default ProtectedRoutes;
