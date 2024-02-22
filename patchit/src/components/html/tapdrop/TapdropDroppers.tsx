import React from "react";

//css && types
import "./css/tapdrop.css";
import { tapdropdropperprops } from "./types";

const TapdropDroppers = (tapdropdropperprops: tapdropdropperprops) => {
  const { dropitem, handleclick, type } = tapdropdropperprops;

  return (
    <div className={ type === "text" ? "dropperstxt" : "droppers" } onClick={ handleclick }>
      { dropitem.imgsrc && (
        <div className="dropperitempicwrapper">
          <img src={ dropitem.imgsrc } alt="drop pics" className="dropperitempic"/>
        </div>
      )}
      { (dropitem.icnsrc && !dropitem.last ) && (
        <i className="material-icons dropperitemicns"> 
          { dropitem.icnsrc } 
        </i>
      )}                                
      { dropitem.value && (
        <div className={ type === "text" ? "dropperitemtext" : "dropperescitemtext" }>
          { dropitem.value }
        </div>
      )}
      { dropitem.last && (
        <>
          { dropitem.icnsrc && (
            <i className="material-icons dropperitemanimation"> 
              { dropitem.icnsrc } 
            </i>
          )}
          { dropitem.btn && (
            <div className="switch dropperitembtn">
              <label>  
              <input type="checkbox" name={ dropitem.btn } className="blue"/>
              <span className="lever"></span>
              </label>
            </div>
          )}
        </>
      )}                                
    </div>  
  )
}

export default TapdropDroppers;
