import React, { useEffect, useState } from 'react';

//components
import Login from './Login';
import Signup from './Signup';
import Magiclogin from './Magiclogin';
import Otherlogins from './Otherlogins';
import Forgotpassword from './Forgotpassword';

//css, types & images
import "./loginbox.css";
import { activeloginleveltype, loginboxpropstype } from './types';
import { ERRORTYPE, VOIDFUNC } from '../../utils/main/types';
const logo: string = require("../../img/logo.png");

function Loginbox(loginboxprops: loginboxpropstype) {
  const { showLogin, setShowLogin } = loginboxprops;
  const active: string = showLogin ? "block" : "none";

  //states
  //0: login, 1: signup, 3: forget password, 4: forget mail sent, 6: magic link, 7: magic link mail sent
  const [activeLoginLevel, setActiveLoginLevel] = useState<activeloginleveltype>(0);
  const [error, setError] = useState<ERRORTYPE>({ status: 0, message: "", show: false });

  //handlers
  const handleLoginDefault: VOIDFUNC = () => {
    setActiveLoginLevel(0);
    setError({ status: 0, message: "", show: false });
  }

  const closeLogin: VOIDFUNC = () => {
    handleLoginDefault();
    setShowLogin(false);
  }

  useEffect(() => {
    if (error.show) {
      setTimeout(() => {
        setError({ status: 0, message: "", show: false });
      }, 3000)
    }
  }, [error])

  return (
    <div className={active}>
      <div className="overlay" >
        <div className="loginbox">
          <i className="material-icons closeicn" onClick={closeLogin}> close </i>
          <div className="logincardlogowrapper">
            <img src={logo} className="logincardlogo" alt={"patch_logo"} onClick={handleLoginDefault} />
          </div>
          <div className={`checkerror ${error?.show ? "showerror" : ""} red lighten-2`}>
            <i className="material-icons checkerroricn">error_outline</i>
            {error.message}
          </div>
          <div className="logincontent">
            {activeLoginLevel === 0 ? (
              <Login
                setError={setError}
                closeLogin={closeLogin}
                setActiveLoginLevel={setActiveLoginLevel}
              />
            ) : activeLoginLevel === 1 ? (
              <Signup
                error={error}
                setError={setError}
                closeLogin={closeLogin}
              />
            ) : (activeLoginLevel === 3 || activeLoginLevel === 4) ? (
              <Forgotpassword
                setError={setError}
                activeLoginLevel={activeLoginLevel}
                setActiveLoginLevel={setActiveLoginLevel}
              />
            ) : (
              <Magiclogin
                setError={setError}
                activeLoginLevel={activeLoginLevel}
                setActiveLoginLevel={setActiveLoginLevel}
              />
            )}
          </div>
          {activeLoginLevel !== 4 && activeLoginLevel !== 7 && (
            <>
              <div className="fliploginbox">
                {activeLoginLevel !== 0 ? "Already on Patch!!" : "New to Patch?"}
                <span
                  className="fliploginboxbtn"
                  onClick={() => activeLoginLevel !== 0 ? handleLoginDefault() : setActiveLoginLevel(1)}
                >
                  {activeLoginLevel !== 0 ? "Continue" : "Start here"}
                </span>
              </div>
              <div className="ortxt">
                Or
              </div>
              <Otherlogins
                closeLogin={closeLogin}
                setError={setError}
                activeLoginLevel={activeLoginLevel}
                setActiveLoginLevel={setActiveLoginLevel}
              />
            </>
          )}
          {activeLoginLevel === 0 && (
            <div className="tc">
              You have already agreed to Patch!! terms & conditions.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Loginbox;