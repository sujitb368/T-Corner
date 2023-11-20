// Import necessary dependencies and components

import { useReducer } from "react";
import { CartContext, cartReducer, initialState } from "../context/cartContext";

// Create the CartProvider component
const CartContextProvider = ({ children }) => {
  // Initialize the cart state and dispatch using the useReducer hook
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Provide the cart state and dispatch function to its children components through the CartContext.Provider
  return (
    <CartContext.Provider value={{ cartState: state, cartDispatch: dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Export the CartContextProvider for use in the application
export { CartContextProvider };
