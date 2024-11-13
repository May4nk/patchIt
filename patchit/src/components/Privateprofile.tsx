import React from 'react';

//css 
import "./css/privateprofile.css";
const privatelogo = require("../img/private.png");

function Privateprofile() {
  return (
    <div className="privateprofilewrapper">
      <img src={privatelogo} alt="" className="privatelogo" />
      <div className="privateprofilemetatext"> seems private.. </div>
      <div className="privateprofiletext">
        Follow to see user activites
      </div>
    </div>
  )
}

export default Privateprofile;