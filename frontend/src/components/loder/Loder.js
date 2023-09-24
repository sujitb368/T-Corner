import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
function Loder() {
  const [count, setCount] = useState(3);

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((pre) => --pre);
    }, 995);

    count === 0 &&
      navigate("/login", {
        state: location.pathname,
      });
    return () => clearInterval(interval);
  }, [count, navigate, location]);
  return (
    <>
      <h5 className="text-center">Redirecting in {count} seconds</h5>
      <Spinner animation="border" />;
    </>
  );
}

export default Loder;
