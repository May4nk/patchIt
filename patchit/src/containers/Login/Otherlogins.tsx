import React from 'react';

//utils
import Patbtn from '../../components/html/Patbtn';
import useLoginvia from '../../utils/helpers/loginvia';

//css, types & images
import "./login.css";
import { otherloginpropstype } from './types';
const googlelogo: string = require("../../img/logo_google.png");
const magiclinklogo: string = require("../../img/meteor_rain_white.png");

function Otherlogins(otherloginprops: otherloginpropstype) {
  const { handleLoginGreetings } = otherloginprops;

  //helpers
  const googlelogin = useLoginvia("googleLogin");
  const anonymouslogin = useLoginvia("anonymousLogin");

  return (
    <div className="loginwithother">
      <div className="loginthrough">
        <Patbtn
          text={"login"}
          img={googlelogo}
          handleClick={() => googlelogin()}
        />
        <Patbtn
          text={"Login"}
          img={magiclinklogo}
          handleClick={() => handleLoginGreetings(7)}
        />
        <Patbtn
          text={"anonymous"}
          icn={"perm_identity"}
          handleClick={() => anonymouslogin()}
        />
      </div>
    </div>
  )
}

export default Otherlogins;