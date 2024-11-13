import React, { useState } from 'react';
import useLoginvia from '../../utils/loginvia';

//components
import Askinput from '../html/Askinput';

//css, types & images
import "./loginbox.css";
import { magicloginpropstype } from './types';
const postman_panda = require("../../img/postman_panda.png");
const magiclogo: string = require("../../img/meteor_rain_white.png");

function Magiclogin(magicloginprops: magicloginpropstype) {
  const { userData, handleChange, magicLoginLevel, setMagicLoginLevel, setError, setUserData } = magicloginprops;
  const magiclogin = useLoginvia("magiclinkLogin");

  //states
  const [clicked, setClicked] = useState(false);

  //handlers
  const handleMagiclogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setClicked(true);
      await magiclogin(userData.email)
        .then(() => {
          setError("");
          setClicked(false);
          setMagicLoginLevel(1);
        }).catch((err) => {
          setClicked(false);
          setError(err.message);
          setUserData({ username: "", password: "", email: "", consent: false, confirm_password: "" });
        });

    } catch (err) {
      if(err instanceof Error) {
        setError(err.message);
      }
    }
  }

  return (
    <>
      {magicLoginLevel === 0 ? (
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
              onChange={handleChange}
              placeholder={"Email"}
              value={userData.email}
            />
          </div>
          <button
            type="submit"
            id="modalloginbtn"
            onClick={(e) => handleMagiclogin(e)}
            className="btn waves-effect waves-light"
            disabled={(userData?.email!.length === 0 || clicked) ? true : false}
          >
            {(!clicked && userData?.email!.length !== 0) && (
              <img src={magiclogo} className="magiclinkbtnimg" alt={"magiclink_logo"} />
            )}
            {!clicked ? "Login" : "sending"}
            {clicked && (
              <i className="material-icons magiclinkbtnicn"> email </i>
            )}
          </button>
        </form>
      ) : magicLoginLevel === 1 && (
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
              {userData.email}
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