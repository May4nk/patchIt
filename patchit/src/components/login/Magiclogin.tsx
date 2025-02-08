import React, { useState } from 'react';

//utils
import useLoginvia from '../../utils/helpers/loginvia';

//components
import Patbtn from '../html/Patbtn';
import Askinput from '../html/Askinput';

//css, types & images
import "./loginbox.css";
import { magicloginpropstype } from './types';
import { ASYNCVOIDFUNC } from '../../utils/main/types';
const postman_panda = require("../../img/postman_panda.png");
const magiclogo: string = require("../../img/meteor_rain_white.png");

function Magiclogin(magicloginprops: magicloginpropstype) {
  const { activeLoginLevel, setActiveLoginLevel, setError } = magicloginprops;
  const magiclogin = useLoginvia("magiclinkLogin");

  //states
  const [clicked, setClicked] = useState(false);
  const [magicLinkUserEmail, setMagicLinkUserEmail] = useState<string>("");

  //handlers
  const handleMagiclogin: ASYNCVOIDFUNC = async (e: React.FormEvent) => {
    e.preventDefault();
    setClicked(true);

    if (magicLinkUserEmail.length < 1) {
      setError({ status: 500, show: true, message: "Email is required!!!" });
      return;
    } else {
      setError({ status: 0, show: false, message: "" });
    }

    try {
      await magiclogin(magicLinkUserEmail)
        .then(() => {
          setError({ status: 0, show: false, message: "" });
          setClicked(false);
          setActiveLoginLevel(7);
        }).catch((err) => {
          setClicked(false);
          setError({ status: 500, show: true, message: "Magic login failed: Check your mail again" });
        });
    } catch (err) {
      setError({ status: 500, show: true, message: "Magic login failed: Check your mail again" });
      setClicked(false);
    }
  }

  return (
    <>
      {activeLoginLevel === 6 ? (
        <form className="magicloginform">
          <div className="magiclinkformhead">
            Tired of passwords?
          </div>
          <div className="magiclinkformbody">
            <div className="magiclinkforminfo">
              Get a magic link on your mail,
            </div>
            <div className="magiclinkforminfo">
              click on sent link to log in or sign up instantly.
            </div>
          </div>
          <div className="loginforminp">
            <Askinput
              name={"email"}
              required={true}
              placeholder={"Email"}
              value={magicLinkUserEmail}
              onChange={(e) => setMagicLinkUserEmail(e.target.value)}
            />
          </div>
          <div className="loginbtnwrapper">
            <Patbtn
              type={"submit"}
              state={"active"}
              lasticn={clicked ? "email" : ""}
              text={!clicked ? "Login" : "sending"}
              disabled={(magicLinkUserEmail!.length === 0 || clicked)}
              handleClick={(e) => handleMagiclogin(e)}
              img={(!clicked && magicLinkUserEmail!.length !== 0) ? magiclogo : ""}
            />
          </div>
        </form>
      ) : activeLoginLevel === 7 && (
        <div className="magiclinksent">
          <img src={postman_panda} className="magiclinksentimg" alt="magiclinkimg" />
          <div className="magiclinksenthead">
            Check your mail
          </div>
          <div className="magiclinksentbody">
            <div className="magiclinksentinfo">
              We mailed a magic link to
            </div>
            <div className="magiclinksentmail">
              {magicLinkUserEmail}
            </div>
            <div className="magiclinksentinfo">
              Click on sent link to log in or sign up instantly.
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Magiclogin;