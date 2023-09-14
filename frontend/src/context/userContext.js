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
  console.log("state, action: ", action.payload.user);
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        token: action.payload.token,
      };
    case "LOGOUT":
      console.log("in logout state");
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        token: null,
      };
    default:
      console.log("in default state");
      return state;
  }
};

export { userReducer, initialUserState };
