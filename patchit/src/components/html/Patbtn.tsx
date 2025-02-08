import React from "react";

//css & types
import "./css/patbtn.css";
import { VOIDFUNC } from "../../utils/main/types";
interface patbtnpropstype {
  text: string;
  icn?: string;
  lasticn?: string;
  theme?: boolean;
  img?: string;
  lastimg?: string
  size?: "small" | "normal" | "big";
  disabled?: boolean;
  handleClick?: VOIDFUNC;
  type?: "submit" | "button";
  state?: "inactive" | "react" | "active" | "clear" | "selected";
}

function Patbtn(patbtnprops: patbtnpropstype) {
  const {
    icn,
    img,
    text,
    lasticn,
    lastimg,
    handleClick,
    theme = false,
    size = "normal",
    type = "button",
    state = "react",
    disabled = false,
  } = patbtnprops;

  return (
    <button
      type={type}
      disabled={disabled}
      {...(handleClick && { onClick: handleClick })}
      className={`        
        ${size}btn
        waves-effect waves-light
        ${theme ? "themecolor" : ""}
        ${state === "active"
          ? "patactivebtn"
          : state === "inactive"
            ? "patinactivebtn"
            : state === "clear"
              ? "patclearbtn"
              : state === "selected" ? "patselectedbtn" : "patbtn"
        }                
      `}
    >
      {(img && (
        <img src={img} className="patbtnpic fronticn" alt="img" />
      ))}
      {(icn) && (
        <i className={`
          material-icons fronticn
          ${state === "inactive"
            ? "patinactivebtnicn"
            : state === "clear"
              ? "patclearbtnicn"
              : "patbtnicn"
          }
        `}>
          {icn}
        </i>
      )}
      {text}
      {(lastimg && (
        <img src={lastimg} className="patbtnpic backicn" alt="img" />
      ))}
      {(lasticn) && (
        <i className={`
          material-icons backicn 
          ${state === "inactive"
            ? "patinactivebtnicn"
            : state === "clear"
              ? "patclearbtnicn"
              : "patbtnicn"
          }
        `}>
          {lasticn}
        </i>
      )}
    </button >
  )
}

export default Patbtn;