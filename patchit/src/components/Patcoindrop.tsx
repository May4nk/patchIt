import React, { useRef } from "react";

//css
import "./css/patcoindrop.css";

const patcoind_pic = require("../img/loading_logo.png");

const Patcoindrop = ({ showPatcoindrop, setShowpatcoindrop, data, icn }: any) => {
  const thisRef = useRef<HTMLDivElement>(null);

  //handler
  const closeDrop = (e: any) => {   
    if(thisRef.current && showPatcoindrop && !thisRef.current.contains(e.target)){
      setShowpatcoindrop(false)
    }
  }
  
  document.addEventListener('mousedown', closeDrop);

  return (
    <div className="patcoindrop" ref={ thisRef }>   
      <div className="navpatcoinwrapper">
        <img className="navpatcoin" onClick={() => setShowpatcoindrop(!showPatcoindrop)} src={patcoind_pic } alt={"patcoin"} />
      </div>
      { showPatcoindrop && (
        <div className="patcoindropcontent">
          <div className="patcoinwrapper"> 
            <img className="patcoin"  src={ patcoind_pic } alt={"patcoin_pic"} />
          </div>
          <div className="patcoinamnt waves-effect waves-light"> 1 Patcoins </div>
          <div className="patcoinabout waves-effect waves-light"> 
            <div className="patcoinlearn"> How to earn patcoins? </div>
          </div>
        </div>
      )}
    </div> 
  )
}

export default Patcoindrop;
