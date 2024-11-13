import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { LoggedUserContext } from "../../context/userContext";
//types
import { authcontexttype, loggedusercontexttype } from "../../context/types";

export const useAuth: () => authcontexttype = () => {
  return useContext(AuthContext);
};

export const useLogged: () => loggedusercontexttype = () => {
  return useContext(LoggedUserContext);
};
