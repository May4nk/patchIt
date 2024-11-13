import React from 'react';
import useLoginvia from '../../utils/loginvia';

//css, types & images
import "./login.css";
const googlelogo: string = require("../../img/logo_google.png");
const magiclinklogo: string = require("../../img/meteor_rain_white.png");

function Otherlogins({ setForgotUsernamelevels }) {
  
  const googlelogin = useLoginvia("googleLogin");
  const anonymouslogin = useLoginvia("anonymousLogin");

  return (
    <div className="loginwithother">
      <div className="loginthrough">
        <div className="waves-effect waves-light loginthroughbtn" onClick={() => googlelogin()}>
          <div className="googlelogoicnwrapper">
            <img src={googlelogo} className="googlelogoicn" alt={"google_logo"} />
          </div>
          oogle
        </div>        
        <div className="waves-effect waves-light loginthroughbtn" onClick={() => setForgotUsernamelevels(7)}>
          <img
            src={magiclinklogo}
            alt={"magiclink_logo"}
            className="magiclinkbtnicon"
          />
          Login
        </div>
        <div className="waves-effect waves-light loginthroughbtn" onClick={() => anonymouslogin()}>
          <i className="material-icons loginthroughbtnicn">
            perm_identity
          </i>
          Anonymous
        </div>
      </div>
    </div>
  )
}

export default Otherlogins;