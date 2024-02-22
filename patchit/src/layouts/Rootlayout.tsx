import React, { useContext } from "react";
import { Outlet } from "react-router-dom";

//components
import Navbar from "../components/Navbar";
import Sidenav from "../components/sidenav/Sidenav";
import { AuthContext } from "../context/authContext";

//css & types
import "./main.css";
import { authcontexttype } from "../context/types";

const Rootlayout = () => {
  const { user }: authcontexttype = useContext(AuthContext);
  
  return (  
    <>
      <div className="nav">
        <Navbar />
      </div>
      <div className="fcontainer">
        { !user && ( 
          <div className="mysidenav">
            <div className="sidebar">
              <Sidenav />
            </div>
          </div>
        )}
        <div className="fcontainerflexy">
          <div className={ user ? "content" : "nocontent" }>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default Rootlayout;
