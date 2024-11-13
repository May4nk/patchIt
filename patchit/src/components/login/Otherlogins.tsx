import React from 'react';

import useLoginvia from '../../utils/loginvia';

//css, types & images
import "./loginbox.css";
import { otherloginpropstype } from './types';

const logo: string = require("../../img/logo.png");
const googlelogo: string = require("../../img/logo_google.png");
const anonlogo: string = require("../../img/logo_anonymous.png");
const magiclogo: string = require("../../img/meteor_rain_white.png");

function Otherlogins(otherloginprops: otherloginpropstype) {
  const { activeLogin, setError, setActiveLogin } = otherloginprops;

  const googlelogin = useLoginvia("googleLogin");
  const anonlogin = useLoginvia("anonymousLogin");

  //handlers
  const handleGoogleLogin: () => void = () => {
    try {
      googlelogin();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="otherformlogin">
      {activeLogin === "magiclogin" ? (
        <div
          onClick={() => setActiveLogin("signup")}
          title="One Click login"
          className="loginotherform waves-effect waves-light"
        >
          <img src={logo} className="magiclinkicn" alt={"anonmyous_logo"} />
          <div> sign up </div>
        </div>
      ) : (
        <div
          onClick={() => setActiveLogin("magiclogin")}
          title="One Click login"
          className="loginotherform waves-effect waves-light"
        >
          <img src={magiclogo} className="magiclinkicn" alt={"magic_logo"} />
          <div> Magin login </div>
        </div>
      )}
      <div
        title="Anonymous login"
        onClick={() => anonlogin()}
        className="loginotherform waves-effect waves-light"
      >
        <img src={anonlogo} className="loginformslogo" alt={"anonmyous_logo"} />
        <div> Anonymous </div>
      </div>
      <div
        title="Google login"
        onClick={handleGoogleLogin}
        className="loginotherform waves-effect waves-light"
      >
        <img src={googlelogo} className="loginformslogo" alt={"google_logo"} />
        <div> oogle </div>
      </div>
    </div>
  )
}

export default Otherlogins;