import React from "react";
import "./css/htab.css";

interface htabprops {
  tabname: string;
  tabicn?: string;
  handleClick: any;
}

const Htab = (htabprops: htabprops) => {
  const { tabname, handleClick, tabicn } = htabprops;

  return (
    <div className="htabwrapper">
      <div className={`htab tab${tabname}`} onClick={ handleClick }>
        { tabicn && (
          <i className="material-icons htabicn"> {tabicn} </i>
        )}
        { tabname }
      </div>
    </div>
  )
}

export default Htab;
