import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { LoggedUserContext } from "../../context/userContext";

export const useAuth = () => {
  return useContext(AuthContext);
}

export const useLogged = () => {
  return useContext(LoggedUserContext);
}
 