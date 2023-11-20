import Swal from "sweetalert2";

/**
 * Message component for displaying toast notifications using SweetAlert2.
 * @param {Object} props - Component properties.
 * @param {string} props.type - Type of the message ('success' or 'error').
 * @param {string} props.message - The message content to be displayed.
 */

function Message({ type, message }) {
  // Configuration for SweetAlert2 toast notification
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

  // Display the toast notification using SweetAlert2
  Swal.fire(toastConfig);

  // Return null as this component doesn't render any visible content
  return null;
}

export default Message;
