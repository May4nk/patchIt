import React from 'react';

//css, images & types
import "./css/infosocial.css";
import { infosocialpropstype } from './types';

const socialIcns = {
  whatsapp: require("../../img/whatsapp.png"),
  twitter: require("../../img/twitter.png"),
  facebook: require("../../img/facebook.png"),
  telegram: require("../../img/telegram.png"),
  insta: require("../../img/insta.png"),
  github: require("../../img/github.png"),
  reddit: require("../../img/reddit.png"),
}

function Infosocial(infosocialprops: infosocialpropstype) {
  const { socialData } = infosocialprops;

  const handleClick: (link: string) => void = (link: string) => {
    window.open(`https://${link}`);
  }

  return (
    <div className="info">
      <div className="infosocialtxt">Any Ideas? Drop here </div>
      <div className="infosocialicnwrapper">
        {socialData && (
          Object.keys(socialData).map((social: string, idx: number) => (
            socialData[social].length > 0 && (
              <img
                key={idx}
                alt={social}
                title={socialData[social]}
                src={socialIcns[social]}
                className="infosocialimg"
                onClick={() => handleClick(socialData[social])}
              />
            )
          ))
        )}
      </div>
    </div>
  )
}

export default Infosocial;

