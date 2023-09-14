import { useReducer } from "react";
import { CartContext, cartReducer, initialState } from "../context/cartContext";

// Create the CartProvider component
const CartContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ cartState: state, cartDispatch: dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContextProvider };
