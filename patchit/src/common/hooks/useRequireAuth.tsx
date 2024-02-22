import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

import { useAuth } from "./useAuth";

import { authcontexttype } from "../../context/types";

// interface authprops {
  // allowedRoles: string[];
// }

const RequireAuth = () => {
  const { user }: authcontexttype = useAuth();
  const location = useLocation();

  return (  
    //user?.roles.find(role => allowedRoles.includes(role));
    user ? <Outlet /> :  <Navigate to={"/account/login"} state={{ from: location }} replace /> 
  )
}

export default RequireAuth;