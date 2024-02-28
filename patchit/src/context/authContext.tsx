import React, { createContext, useReducer } from "react";
import { jwtDecode } from "jwt-decode";

import {
  authcontexttype,
  initialstatetype,
  tokentype,
  userdatatype
} from "./types";

const initialState: initialstatetype = {
  user: null
}

const token: string|null = localStorage.getItem("token");

if (token !== null) {
  const decodedToken: tokentype = jwtDecode<tokentype>(token);

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("token");
  } else { 
    initialState.user = decodedToken;    
  }
}

const AuthContext = createContext<authcontexttype>({
  user: null,
  login: (userData: userdatatype) => {},
  logout: () => {},
})


const AuthReducer = (state: initialstatetype, action: any) => {
  switch(action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload
      }
    case "LOGOUT":
      return {
        ...state,
        user: null
      }
    default:
      return state
  } 
}

const AuthProvider = (props: any) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const login: (userData: userdatatype) => void = (userData: userdatatype) => {  
    localStorage.setItem("token", userData.token);  
    dispatch({
      type: "LOGIN",
      payload: userData
    })
  }
  const logout: () => void = () => {
    localStorage.removeItem("token");
    dispatch({
      type: "LOGOUT"
    });
  }
  
  return (
    <>
      <AuthContext.Provider 
        value={ { user: state.user, login, logout } }
        { ...props } 
      />
    </>
  )
}

export { AuthContext, AuthProvider }; 