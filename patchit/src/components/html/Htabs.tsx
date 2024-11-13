import React from "react";

//css & types
import "./css/htab.css";
import { htabpropstype } from "./types";

const Htab = (htabprops: htabpropstype) => {
  const { tabname, handleClick, tabicn } = htabprops;

  return (
    <div className="htabwrapper">
      <div className={`htab tab${tabname}`} onClick={handleClick}>
        {tabicn && (
          <i className="material-icons htabicn"> {tabicn} </i>
        )}
        {tabname}
      </div>
    </div>
  )
}

export default Htab;
