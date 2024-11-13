import React, { useState } from "react";
import { Link } from "react-router-dom";
import useLoginvia from "../../utils/loginvia";
import Otherlogins from "./Otherlogins";
import { Randomcred } from "../../utils/helpers";

//component
import Askinput from "../../components/html/Askinput";

//css,types & images
import "./login.css";
import { allNames } from "../../constants/const";
import { userdatatypes } from "./types.js";
const logo: string = require("../../img/logo.png");

const Signup = () => {

  const randomUsername = Randomcred("username");
  const signupAndLogin = useLoginvia("signupAndLoginUser");

  //states
  const [level, setLevel] = useState<number>(1);
  const [checkError, setCheckError] = useState<string>("");
  const [userData, setUserData] = useState<userdatatypes>({ username: "", password: "", email: "" });

  //handlers
  const signingup: (e: any) => Promise<void> = async (e) => {
    e.preventDefault();
    if (checkError.length < 1) {
      try {
        await signupAndLogin();
      } catch (err) {
        console.log(err);
      }
    }
  }

  const handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="loginpage">
      <div className="signupbody">
        <div className="signupbodyheader">
          <Link to={"/c/popular"}>
            <img src={logo} className="loginpagelogopic" alt={"patch_logo"} />
          </Link>
          <div className="loginpagetitle">Sign up </div>
          <div className="loginpagemetatitle">
            You are setting up a Patch account and agreeing to our Privacy Policy.
          </div>
        </div>
        <div className="signupbodycontent">
          {level === 1 && (
            <>
              <div className="signupbodycontentheader">
                <Otherlogins
                  setForgotUsernamelevels={setLevel}
                />
              </div>
            </>
          )}
          <div className="signupbodycontentbody">
            {level === 1 ? (
              <div className="loginpageform">
                <div className="loginpageinputs">
                  <Askinput
                    name={"email"}
                    placeholder={"Email"}
                    onChange={handleChange}
                    value={userData?.email}
                  />
                </div>
                <button
                  onClick={() => setLevel(2)}
                  disabled={userData?.email?.length === 0 ? true : false}
                  className="waves-effect waves-light btn loginpagebtn black-text blue-grey lighten-1"
                >
                  Continue
                </button>
              </div>
            ) : level === 2 && (
              <form className="loginpageform" onSubmit={signingup}>
                <div className="loginpageinputs">
                  <Askinput
                    prefixes={["u/"]}
                    name={"username"}
                    onChange={handleChange}
                    placeholder={"Username"}
                    value={userData.username}
                    postfix={"ICimport_export"}
                    onClickPostfix={() => setUserData({ ...userData, username: randomUsername(allNames) })}
                  // onBlur={handleFocus}
                  />
                </div>
                {checkError.length > 1 && (
                  <div className="check red-text">
                    {checkError}
                  </div>
                )}
                <div className="loginpageinputs">
                  <Askinput
                    name={"password"}
                    type={"password"}
                    placeholder={"Password"}
                    onChange={handleChange}
                    value={userData.password}
                  />
                </div>
                <button
                  className="waves-effect waves-light btn black-text loginpagebtn"
                  type="submit"
                  disabled={(userData?.username?.length === 0 || userData?.password?.length === 0) ? true : false}
                >
                  Sign In
                </button>
              </form>
            )}
          </div>
        </div>
        <div className="loginpagesignup">
          Continue your ongoing journey
          <Link to={"/account/login"} className="loginpageextrapd">here</Link>
        </div>
      </div>
    </div>
  );
}


export default Signup;
