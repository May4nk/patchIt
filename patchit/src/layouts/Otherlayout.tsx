import React from "react";
import { Outlet } from "react-router-dom";

//components
import Navbar from "../components/Navbar";

//css
import "./main.css";

const Otherlayout = () => {
  return (  
    <>
      <div className="nav">
        <Navbar />
      </div>
      <div className="othercontainer">
        <Outlet />
      </div>
    </>
  );
}

export default Otherlayout;
