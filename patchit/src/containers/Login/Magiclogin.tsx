import React, { useState } from 'react';

//utils
import useLoginvia from '../../utils/helpers/loginvia';

//components
import Patbtn from '../../components/html/Patbtn';
import Askinput from '../../components/html/Askinput';

//css, pics & types
import "./login.css";
import { magicloginpropstype } from './types';

const mailpic: string = require("../../img/maillogo.png");
const magiclogo: string = require("../../img/meteor_rain_white.png");

function Magiclogin(magicloginprops: magicloginpropstype) {
  const { setError, error, loginLevel, handleLoginGreetings } = magicloginprops;

  //utils
  const magiclogin = useLoginvia("magiclinkLogin");

  //states
  const [clicked, setClicked] = useState<boolean>(false);
  const [magicLoginEmail, setMagicLoginEmail] = useState<string>("");

  //handlers
  const handleMagicLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setClicked(true);

      if (magicLoginEmail.length < 2) {
        setError({ status: 500, message: "Email is required!", show: true });
        return;
      }

      await magiclogin(magicLoginEmail)
        .then(() => {
          setError({ status: 0, message: "", show: false });
          setClicked(false);
          handleLoginGreetings(8);
        }).catch(() => {
          setClicked(false);
          setError({ status: 500, message: "Magic Login failed: Please check your mail & try again", show: true });
        });

    } catch (err) {
      setClicked(false);
      setError({ status: 500, message: "Magic Login failed: Please check your mail & try again", show: true });
    }
  }

  return (
    <>
      <div className="loginpageformhead">
        <div className="loginpageformheadtxt">
          Tired of passwords?
        </div>
        <div className="loginpageformheadmetatxt">
          Get a magic link on your mail,
        </div>
        <div className="loginpageformheadmetatxt">
          click on sent link to log in instantly.
        </div>
      </div>
      <div className="loginpageformbody">
        {loginLevel === 7 ? (
          <form className="loginpageformloginform" onSubmit={handleMagicLogin}>
            <div className="loginpageinputs">
              <Askinput
                name={"email"}
                required={true}
                placeholder={"Email"}
                value={magicLoginEmail}
                onChange={(e) => setMagicLoginEmail(e.target.value)}
              />
            </div>
            <div className="loginpagebtnwrapper">
              <Patbtn
                type={"submit"}
                state={"active"}
                img={!clicked ? magiclogo : ""}
                lasticn={clicked ? "email" : ""}
                text={!clicked ? "Login" : "Sending"}
                disabled={(magicLoginEmail?.length === 0 || clicked)}
              />
            </div>
          </form>
        ) : loginLevel === 8 ? (
          <div className="clicksignupbox">
            <div className="clicksignuppic">
              <img src={mailpic} className="clicksignuppic" alt={"mail_pic"} />
            </div>
            <div className="clicksignuptitle">
              Mail sent successfully
              <div className="material-icons clicksignuptitleicn"> mail_outline </div>
            </div>
            <div className="clicksignupmetatitle">
              Click on the sent link to login into your account.
            </div>
          </div>
        ) : loginLevel === 9 && (
          <div className="clicksignupbox">
            <div className="clicksignuppic">
              <img src={mailpic} className="clicksignuppic" alt={"mail_pic"} />
            </div>
            <div className="clicksignuptitle">
              {error.status === 500 ? "verification failed" : "Verifying"}
              <i
                className={`material-icons clicksignuptitleicn ${error.status === 500 ? "red-text" : "blue-text"}`}
              >
                mail_outline
              </i>
            </div>
            <div className="clicksignupmetatitle">
              {error.status === 500 ? "Redirecting to patchit..." : "You will be redirected in a jiffy..."}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Magiclogin;