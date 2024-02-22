import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./css/loadingpage.css"; //css

const logo:string = require("../img/loading_logo.png");

interface loadingpageprops {
  err?: string
}

const Loadingpage = (loadingpageprops: loadingpageprops) => {
  const { err } = loadingpageprops;
  const navigate = useNavigate();

  useEffect(() => {
    if(err) {
      setTimeout(() => {
        navigate("/home");
      }, 3000);
    }
  }, [err])

  return(
    <div className="loadingwrapper">
      <div className="btn-floating loadinglogo1 pulse">
        <img src={ logo } id="loadinglogo" alt={"loading_logo"}/>
      </div>
      <div className="loadingtext"> { err ? err : "Loading..." } </div>
      { err && (
        <div className="loadingmetatext"> Redirecting... </div>
      )}
    </div>
  )
}

export default Loadingpage;
