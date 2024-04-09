import React from 'react';
import "./css/patchip.css";
let pic: string = require("../../img/unnamed.jpg");
interface patchipprops {
  title: string;
  img?: string;
  icn?: string;
}

function Patchip(patchipprops: patchipprops) {
  const { title, img, icn } = patchipprops;

  return (
    <div className="patchip waves-effect waves-light">
      {img && (
        <div className="patchipimgwrapper">
          <img src={pic} alt="pic" className="patchipimg" />
        </div>
      )}
      {icn && (
        <i className="material-icons privacyicn">
          {icn}
        </i>
      )}
      {title}
    </div>
  )
}

export default Patchip;