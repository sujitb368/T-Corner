import { useReducer } from "react";

const initialUserState = {
  user: null,
  isAuthenticated: false,
  token: null,
};

//define action types
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGOUT = "LOGOUT";

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        token: action.payload.token,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        token: null,
      };
    default:
      return state;
  }
};

export { userReducer, initialUserState };
