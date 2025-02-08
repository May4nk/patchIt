import React from "react";
//css & types
import "./css/postrulestab.css";
const logo: string = require("../../img/loading_logo.png");
interface postruletabprops {
  about: string;
  active: boolean;
}

const Postrulestab = (postruletabprops: postruletabprops) => {
  const { about, active } = postruletabprops;
  const showlogo: string = active ? "block" : "none";

  return (
    <div className="tab">
      <div className={active ? "tabtitle" : "tabname"}>
        <img src={logo} id="ruleslogo" className={showlogo} alt="logo" />
        {about}
      </div>
    </div>
  )
}

export default Postrulestab;
