import React from "react";

import "./css/postrulestab.css"; //css

const logo: string = require("../../img/loading_logo.png"); //logo

interface postruletabprops { 
  about: string;
  active: boolean;
}

const Postrulestab = (postruletabprops: postruletabprops ) => {
  const { about, active } = postruletabprops;
  const showlogo: string = active ? "block" : "none";
  
  return (
    <div className="tab">
      <div className={ active ? "tabtitle" : "tabname" }> 
       <img src={ logo } id="ruleslogo" className={ showlogo } alt="logo"/> 
        { about }
      </div>
    </div>
  )
}

Postrulestab.defaultProps = {
  active: false
}

export default Postrulestab;
