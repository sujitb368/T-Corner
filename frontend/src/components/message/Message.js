import Swal from "sweetalert2";

function Message({ type, message }) {
  const toastConfig = {
    timer: 2000,
    timerProgressBar: true,
    backdrop: false,
    toast: true,
    position: "top-end",
    icon: type === "success" ? "success" : "error",
    title: type === "success" ? message : "Oops...",
    text: type === "success" ? "" : message,
  };

  Swal.fire(toastConfig);

  return null; // Return null as this component doesn't render any visible content
}

export default Message;
