import React, { createContext, useContext } from "react";

// Define initial state for the cart
const initialState = {
  cartItems: [],
  user: [],
  token: null,
};

// Create the context object
const CartContext = createContext();

//define reducer function to handle cart actions

const cartReducer = (state, action) => {
  switch (action.type) {
    //user authentication
    case "LOGIN_SUCCESS":
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
      };
    case "LOGIN_FAIL":
      return { ...state, user: [], token: null };
    case "LOAD_CART":
      return { ...state, cartItems: action.payload };
    // cart context operation
    case "ADD_TO_CART":
      // check if the item is already in the cart
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.productId === action.payload.productId
      );
      if (existingItemIndex !== -1) {
        // If it exists, update the quantity
        const updatedCartItems = [...state.cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        return { ...state, cartItems: updatedCartItems };
      } else {
        // If it's a new item, add it to the cart
        return { ...state, cartItems: [...state.cartItems, action.payload] };
      }
    case "REMOVE_FROM_CART":
      //Filter out items that need to be removed from the cart
      const updatedCartItems = state.cartItems.filter(
        (item) => item.id !== action.payload.id
      );
      return { ...state, cartItems: updatedCartItems };

    case "INCREASE_QUANTITY":
      const updatedCart = state.cartItems.map((item) => {
        if (item.productId === action.payload) {
          //increase the quantity for matching product
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      return { ...state, cartItems: updatedCart };

    case "DECREASE_QUANTITY":
      const updatedCart2 = state.cartItems.map((item) => {
        if (item.productId === action.payload && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
      return { ...state, cartItems: updatedCart2 };

    case "DELETE_ITEM":
      const updatedCart3 = state.cartItems.filter(
        (item) => item.productId !== action.payload
      );
      return { ...state, cartItems: updatedCart3 };
    case "CLEAR_CART":
      //clear the entire cart
      return { ...state, cartItems: action.payload };
    //shipping address to deliver the product
    case "SHIPPING_ADDRESS":
      return { ...state, shippingAddress: action.payload };
    default:
      return state;
  }
};

// Custom hook to access the cart context
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export { CartContext, cartReducer, initialState, useCart };
