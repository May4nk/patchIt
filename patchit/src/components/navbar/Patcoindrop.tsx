import React, { useRef } from "react";
import { Link } from "react-router-dom";

//components
import Patbtn from "../html/Patbtn";

//css
import "./css/patcoindrop.css";
import { patcoindroppropstype } from "./types";
const patcoind_pic = require("../../img/loading_logo.png");

const Patcoindrop = (patcoindropprops: patcoindroppropstype) => {
  const { showPatcoindrop, setShowPatcoindrop } = patcoindropprops;

  const thisRef = useRef<HTMLDivElement>(null);

  //handlers
  const closeDrop = (e: any) => {
    if (thisRef.current && showPatcoindrop && !thisRef.current.contains(e.target)) {
      setShowPatcoindrop(false)
    }
  }

  document.addEventListener('mousedown', closeDrop);

  return (
    <div className="patcoindrop" ref={thisRef}>
      <div className="navpatcoinwrapper">
        <img
          className="navpatcoin"
          src={patcoind_pic}
          alt={"patcoin"}
          title="patcoins"
          onClick={() => setShowPatcoindrop(!showPatcoindrop)}
        />
      </div>
      {showPatcoindrop && (
        <div className="patcoindropcontent">
          <div className="patcoinwrapper">
            <img className="patcoin" src={patcoind_pic} alt={"patcoin_pic"} />
          </div>
          <Link to={"/patcoin/dashboard"}>
            <Patbtn
              text={"0 Patcoin"}
            />
          </Link>
          <div className="patcoinabout waves-effect waves-light">
            <div className="patcoinlearn">
              How to earn patcoins?
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Patcoindrop;
