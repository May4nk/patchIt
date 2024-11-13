import React from "react";
import { Outlet } from "react-router-dom";

//components
import Navbar from "../components/navbar/Navbar";
import Sidenav from "../components/sidenav/Sidenav";
import { useAuth } from "../utils/hooks/useAuth";

//css & types
import "./main.css";
import { authcontexttype } from "../context/types";

const Rootlayout = () => {
  const { user }: authcontexttype = useAuth();

  return (
    <>
      <div className="nav">      
        <Navbar />
      </div>
      <div className="fcontainer">
        {!user && (
          <div className="mysidenav">
            <div className="sidebar">
              <Sidenav />
            </div>
          </div>
        )}        
        <div className="fcontainerflexy">
          <div className={user ? "content" : "nocontent"}>       
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default Rootlayout;
