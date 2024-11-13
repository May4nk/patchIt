import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

//css, image & types
import "./css/loadingpage.css";
const logo: string = require("../img/loading_logo.png");
interface loadingpageprops {
  err?: string;
  msg?: string;
  onErrorMsg?: string;
  onError?: () => void;
}

const Loadingpage = (loadingpageprops: loadingpageprops) => {
  const { msg, err, onError, onErrorMsg } = loadingpageprops;
  const navigate = useNavigate();

  useEffect(() => {
    if (err || msg) {
      setTimeout(() => {
        onError ? onError() : navigate("/home");
      }, 3000);
    }
  }, [err]);

  return (
    <div className="loadingwrapper">
      <div className="btn-floating loadinglogowrapper pulse">
        <img
          src={logo}
          id="loadinglogo"
          alt={"loading_logo"}
        />
      </div>
      <div className="loadingtext">
        {err
          ? `Error: ${err.length > 37 ? err.substring(0, 47) + "..." : err}`
          : msg
            ? msg
            : "Loading..."
        }
      </div>
      {(err || msg) && (
        <div className="loadingmetatext">
          {onErrorMsg ? onErrorMsg : "Redirecting..."}
        </div>
      )}
    </div>
  )
}

export default Loadingpage;
