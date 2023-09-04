import React from "react";

function Message(props) {
  return (
    <p
      className={`m-0 d-inline-block ${
        props?.success ? "text-2" : "text-danger"
      }`}
    >
      {props.message}
    </p>
  );
}

export default Message;
