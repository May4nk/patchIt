import React, { useEffect, useState } from 'react';

//components
import Patbtn from '../html/Patbtn';
import Socialchips from './Socialchips';
import Askinput from '../html/Askinput';

//types, images & css
import "./main.css";
import { socialboxpropstype, sociallinktype, socialnames } from './types';

const socialIcns = {
  whatsapp: require("../../img/whatsapp.png"),
  twitter: require("../../img/twitter.png"),
  facebook: require("../../img/facebook.png"),
  telegram: require("../../img/telegram.png"),
  insta: require("../../img/insta.png"),
  github: require("../../img/github.png"),
  reddit: require("../../img/reddit.png"),
}

function Socialbox(socialBoxProps: socialboxpropstype) {
  const { setShowSocialBox, handleUpdate, setUpdatedLinks, socialMediaLinks } = socialBoxProps;

  //states
  const [addSocial, setAddSocial] = useState<boolean>(false);
  const [activeSocial, setActiveSocial] = useState<string>("");
  const [socialLinks, setSocialLinks] = useState<sociallinktype>({
    insta: "",
    github: "",
    reddit: "",
    twitter: "",
    facebook: "",
    whatsapp: "",
    telegram: ""
  });

  //handlers
  const handleDefault: () => void = () => {
    setAddSocial(false);
    setActiveSocial("");
    setShowSocialBox(false);
  }

  const handleSocialLinks: (name: socialnames) => void = (name: socialnames) => {
    setAddSocial(true);
    setActiveSocial(name);
  }

  const handleUpdateLink: (e: any) => void = (e: any) => {
    setSocialLinks(prev => ({ ...prev, [activeSocial]: e.target.value }));
  }

  useEffect(() => {
    if (Object.values(socialLinks).length > 0) {
      setUpdatedLinks(JSON.stringify(socialLinks));
    }
  }, [socialLinks])

  useEffect(() => {
    if (socialMediaLinks) {
      setSocialLinks(JSON.parse(socialMediaLinks));
    }
  }, []);

  return (
    <div className="socialbox">
      <div className="socialboxtitle">
        Social links
      </div>
      <div className="socialboxbody">
        <div className="sociallinks">
          {Object.keys(socialLinks).map((social: string, idx: number) => (
            <Socialchips
              key={idx}
              socialData={{ name: social as socialnames, link: socialLinks[social as socialnames] }}
              handleClick={handleSocialLinks}
            />
          ))}
        </div>
        {(addSocial && activeSocial) && (
          <div className="upsertsocial">
            <img
              alt="socialicn"
              className="socialpic"
              src={socialIcns[activeSocial]}
            />
            <div className="sociallinkinp">
              <Askinput
                name={activeSocial}
                placeholder={activeSocial}
                prefixes={["https://"]}
                value={socialLinks[activeSocial]}
                onChange={(e) => handleUpdateLink(e)}
              />
            </div>
          </div>
        )}
      </div>
      <div className="textboxfooter">
        <Patbtn
          text={"cancel"}
          state="clear"
          handleClick={handleDefault}
        />
        <Patbtn
          text={"update"}
          state="selected"
          handleClick={() => { handleUpdate(); handleDefault(); }}
        />
      </div>
    </div>
  )
}

export default Socialbox;