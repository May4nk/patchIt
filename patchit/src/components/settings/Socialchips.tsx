import React from 'react';

//types & css
import "./main.css";
import { socialchippropstype } from './types';

const socialIcns = {
  whatsapp: require("../../img/whatsapp.png"),
  twitter: require("../../img/twitter.png"),
  facebook: require("../../img/facebook.png"),
  telegram: require("../../img/telegram.png"),
  insta: require("../../img/insta.png"),
  github: require("../../img/github.png"),
  reddit: require("../../img/reddit.png"),
}

function Socialchips(socialchipprops: socialchippropstype) {
  const { socialData, handleClick } = socialchipprops;
  const { name, link } = socialData;  

  return (
    <div className="socialchipbody">
      <img
        title={link}
        alt="social_pic"
        src={socialIcns[name]}
        onClick={() => handleClick(name)}
        className={`socialicn ${link.length > 1 && "socialicnlink"}`}
      />
    </div>
  )
}

export default Socialchips;