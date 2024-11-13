import React, { useEffect, useState } from 'react';

//components
import Login from './Login';
import Signup from './Signup';
import Magiclogin from './Magiclogin';
import Otherlogins from './Otherlogins';
import Forgotusername from './Forgotusername';
import Forgotpassword from './Forgotpassword';

//css, types & images
import "./loginbox.css";
import { activelogintype, loginboxpropstype, loginforgetdatatype, loginuserdatatype } from './types';
const logo: string = require("../../img/logo.png");

function Loginbox(loginboxprops: loginboxpropstype) {
  const { showLogin, setShowLogin } = loginboxprops;
  const active: string = showLogin ? "block" : "none";

  //states
  const [error, setError] = useState<string>("");
  const [activeLogin, setActiveLogin] = useState<activelogintype>("login");
  const [forgetLevel, setForgetLevel] = useState<number>(0); // level 0: default, 1: username, 2: password
  const [magicLoginLevel, setMagicLoginLevel] = useState<number>(0); //magic levels 0: default, 1: mail sent
  const [forgotData, setForgotData] = useState<loginforgetdatatype>({
    forgotemail: "",
    forgotusername: "",
    forgotpassword: ""
  });
  const [userData, setUserData] = useState<loginuserdatatype>({
    email: "",
    username: "",
    password: "",
    consent: false,
    confirm_password: "",
  });

  //handlers
  const handleLoginDefault: () => void = () => {
    setError("");
    setForgetLevel(0);
    setActiveLogin("login");
    setMagicLoginLevel(0);
    setUserData({ username: "", password: "", email: "", consent: false, confirm_password: "" });
  }

  const closeLogin: () => void = () => {
    handleLoginDefault();
    setShowLogin(false);
  }

  const handleChange: (e: any) => void = (e: any) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  }

  const handleForgetChange: (e: any) => void = (e) => {
    setForgotData({
      ...forgotData,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    if(error.length > 1) {
      setTimeout(() => {
        setError("");
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
            <div className={`checkerror ${error.length > 0 ? "showerror": ""} red lighten-2`}>
              <i className="material-icons checkerroricn">error_outline</i>
              {error}
            </div>          
          <div className="logincontent">
            {activeLogin === "magiclogin" ? (
              <Magiclogin
                userData={userData}
                setError={setError}
                setUserData={setUserData}
                handleChange={handleChange}
                magicLoginLevel={magicLoginLevel}
                setMagicLoginLevel={setMagicLoginLevel}
              />
            ) : activeLogin === "login" ? (
              forgetLevel === 0 ? (
                <Login
                  userData={userData}
                  setError={setError}
                  closeLogin={closeLogin}
                  handleChange={handleChange}
                  setForgetLevel={setForgetLevel}
                />
              ) : forgetLevel === 1 ? (
                <Forgotusername
                  forgotData={forgotData}
                  handleForgetChange={handleForgetChange}
                />
              ) : forgetLevel === 2 && (
                <Forgotpassword
                  forgotData={forgotData}
                  handleForgetChange={handleForgetChange}
                />
              )
            ) : activeLogin === "signup" && (
              <Signup
                error={error}
                userData={userData}
                setError={setError}
                setUserData={setUserData}
                handleChange={handleChange}
                closeLogin={closeLogin}
              />
            )}
          </div>
          {magicLoginLevel !== 1 && (
            <>
              <div className="fliploginbox">
                {activeLogin !== "login" ? "Already on Patch!!" : "New to Patch?"}
                <span
                  className="fliploginboxbtn"
                  onClick={() => activeLogin !== "login" ? handleLoginDefault() : setActiveLogin("signup")}
                >
                  {activeLogin !== "login" ? "Continue" : "Start here"}
                </span>
              </div>
              <div className="ortxt">
                Or
              </div>
              <Otherlogins
                activeLogin={activeLogin}
                setError={setError}
                setActiveLogin={setActiveLogin}
              />
            </>
          )}
          {activeLogin === "login" && (
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