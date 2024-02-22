import React from "react";

//css & types
import "./patdrop.css";
import { patdropperprops } from "./types";

const Patdropper = (patdropperprops: patdropperprops) => {
  const { dropped, handleClick } = patdropperprops;

  return (  
    <div className={ dropped?.text ? "patdroppertxt": "patdropper" } id="patdropper" onClick={ handleClick }>
      { dropped?.last && (
        <div className="patlastdropper">
          { dropped?.value }
        </div>
      )}
      { dropped?.img && (
        <div className="patdropperimgwrapper">
          <img src={ dropped?.img } alt="dropper_pic" className="patdropperimg" />
        </div>
      )}
      { dropped?.icn && (
        <i className={`material-icons ${ !dropped?.last ? "patdroppericn" : "patdropperlasticn" }`}>
          { dropped?.icn } 
        </i>
      )}
      { !dropped?.last && (
        dropped?.value
      )}
    </div>  
  )
}

export default Patdropper;
