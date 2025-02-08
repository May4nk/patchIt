import React from 'react';

//utils
import useLoginvia from '../../utils/helpers/loginvia';

//components
import Patbtn from '../html/Patbtn';

//css, types & images
import "./loginbox.css";
import { otherloginpropstype } from './types';
import { VOIDFUNC } from '../../utils/main/types';
const logo: string = require("../../img/logo.png");
const googlelogo: string = require("../../img/logo_google.png");
const anonlogo: string = require("../../img/logo_anonymous.png");
const magiclogo: string = require("../../img/meteor_rain_white.png");

function Otherlogins(otherloginprops: otherloginpropstype) {
  const { activeLoginLevel, setError, setActiveLoginLevel, closeLogin } = otherloginprops;
  const googlelogin = useLoginvia("googleLogin");
  const anonlogin = useLoginvia("anonymousLogin");

  //handlers
  const handleGoogleLogin: VOIDFUNC = () => {
    try {
      googlelogin();
      closeLogin()
    } catch (err) {
      setError({ status: 500, show: true, message: "Google login failed: Something went wrong" });
    }
  }

  const handleAnonlogin: VOIDFUNC = () => {
    anonlogin();
    closeLogin();
  }

  return (
    <div className="otherformlogin">
      {activeLoginLevel === 6 ? (
        <Patbtn
          img={logo}
          text={"Sign Up"}
          handleClick={() => setActiveLoginLevel(1)}
        />
      ) : (
        <Patbtn
          img={magiclogo}
          text={"login"}
          handleClick={() => setActiveLoginLevel(6)}
        />
      )}
      <Patbtn
        img={anonlogo}
        text={"Anonymous"}
        handleClick={handleAnonlogin}
      />
      <Patbtn
        text={"login"}
        img={googlelogo}
        handleClick={handleGoogleLogin}
      />
    </div>
  )
}

export default Otherlogins;