import React from 'react';

//css, pic & types
import "./css/patchip.css";
import { patchippropstype } from './types';

function Patchip(patchipprops: patchippropstype) {
  const { title, img, icn } = patchipprops;

  return (
    <div className="patchip waves-effect waves-light">
      {img && (
        <div className="patchipimgwrapper">
          <img src={img} alt="pic" className="patchipimg" />
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