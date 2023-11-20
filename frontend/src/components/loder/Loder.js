import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Loader component displaying a countdown before redirection.
 * @param {Object} props - Component properties.
 * @param {boolean} props.redirect - Determines whether redirection is enabled.
 */
function Loder({ redirect }) {
  const [count, setCount] = useState(2);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // if (redirect) {
    const interval = setInterval(() => {
      setCount((pre) => --pre);
    }, 995);

    // Redirect to the specified path after the countdown reaches zero
    count === 0 &&
      navigate("/login", {
        state: location.pathname,
      });
    return () => clearInterval(interval);
    // }
  }, [count, navigate, location, redirect]);
  return (
    <>
      {/* {redirect && (
        <h5 className="text-center">Redirecting in {count} seconds</h5>
      )} */}
      <div className="d-flex justify-content-center align-items-center">
        <Spinner animation="border" />;
      </div>
    </>
  );
}

export default Loder;
