import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

import useLoginvia from "../common/loginvia";
import { useAuth, useLogged } from "../common/hooks/useAuth";

//component
import Askinput from "../components/html/Askinput";
import Errorcard from "../components/Errorcard";

import { GETUSERBYTOKEN } from "../common/loginqueries"; //queries

//css
import "./css/login.css";
import { userdatatypes } from "./types/logintypes.js";
import { authcontexttype } from "../context/types.js";

const logo: string = require("../img/logo.png");
const googlelogo: string = require("../img/logo_google.png");
const mailpic: string = require("../img/maillogo.png");

const Login = () => {
  const navigate = useNavigate();
  const { verifycode } = useParams();
  const auth: authcontexttype = useAuth();
  const { updateLoggedUser } = useLogged();

  const googlelogin = useLoginvia("googleLogin");
  const anonymouslogin = useLoginvia("anonymousLogin")
  const magiclogin = useLoginvia("magiclinkLogin");
  const login = useLoginvia("login");

  const [userByToken] = useLazyQuery(GETUSERBYTOKEN);

  //states
  const [userData, setUserData] = useState<userdatatypes>({ email: "", password: "", username: "" });
  const [forgotUsernameLevels, setForgotUsernamelevels] = useState<number>(0);
  const [clicked, setClicked] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  //handlers   
  const handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    })
  }

  const handleOneClickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setClicked(true);
    const mailSent = await magiclogin(userData.email);
    if (mailSent.status === 200) {
      setClicked(false);
      setUserData({ email: "", username: "", password: "" });
      setForgotUsernamelevels(200);
    }
  }

  const logingUser: (e: React.FormEvent) => void = async (e) => {
    e.preventDefault();
    if (userData?.username?.length !== 0 && userData?.password?.length !== 0) {
      const { email, ...loginData } = userData;
      login(loginData).catch((err: string) => {
        setError(err);
      });
    }
  }

  useEffect(() => {
    if (auth.user !== null) {
      navigate("/home");
    }

    if (verifycode !== undefined && verifycode?.length !== 0) {
      setForgotUsernamelevels(201);
      userByToken({
        variables: {
          filter: {
            token: verifycode!
          }
        }
      }).then(({ data }: any) => {
        if (data) {
          const loggedinData = data?.listTokens[0]?.user_id;
          auth.login(loggedinData);
          updateLoggedUser({ new_user: loggedinData?.new! });
          navigate("/home");
        }
      })
    }
  }, [])

  return (
    <div className="loginpage">      
      <div className="loginbody">
        <div className="loginbodyheader">
          {forgotUsernameLevels !== 201 && (
            <Link to={"/c/popular"}>
              <img src={logo} className="loginpagelogopic" alt={"logo"} />
            </Link>
          )}
          <div className="loginpagetitle">
            { forgotUsernameLevels === 0 ? "Log in" :
              forgotUsernameLevels === 1 ? "find Username" :
              forgotUsernameLevels === 2 ? "Forgot Password" :
              forgotUsernameLevels === 7 && "Magic login"
            }
          </div>
          {forgotUsernameLevels === 0 ? (
            <div className="loginpagemetatitle">
              By continuing, you agree to our User Agreement.
            </div>
          ) : forgotUsernameLevels === 1 ? (
            <div className="loginpagemetatitle">
              By access of your email, you can have your username to login
            </div>
          ) : forgotUsernameLevels === 2 ? (
            <div className="loginpagemetatitle">
              Get your password reset link in your mail
            </div>
          ) : forgotUsernameLevels === 7 && (
            <div className="loginpagemetatitle">
              Check mail for otp to login
            </div>
          )}
        </div>
        <div className="loginbodycontent">
          <div className="loginbodycontentheader">
            {forgotUsernameLevels === 0 ? (
              <div className="loginwithother">
                <div className="loginthrough">
                  <div className="waves-effect waves-light loginthroughbtns" onClick={() => googlelogin()}>
                    <div className="googlelogoicnwrapper">
                      <img src={googlelogo} className="googlelogoicn" alt={"google_logo"} />
                    </div>
                    oogle
                  </div>
                  <div className="waves-effect waves-light loginthroughbtns" onClick={() => setForgotUsernamelevels(7)}>
                    <img src={require("../img/meteor_rain_white.png")} className="magiclinkbtnicon" alt={"magiclink_logo"} />
                    Magic Login
                  </div>
                </div>
                <div className="anonlogin">
                  <div className="waves-effect waves-light loginthroughbtn" onClick={() => anonymouslogin()}>
                    <i className="material-icons loginthroughbtnicn">
                      perm_identity
                    </i>
                    Anonymous browsing
                  </div>
                </div>
              </div>
            ) : forgotUsernameLevels !== 201 && (
              <div className="loginpagebackarrow" onClick={() => setForgotUsernamelevels(0)}>
                <i className="material-icons">arrow_back</i>
              </div>
            )}
          </div>
          <div className="loginbodycontentbody">
            {forgotUsernameLevels === 0 ? (
              <form className="loginpageform" onSubmit={logingUser}>
                <div className="loginpageinputs">
                  <Askinput
                    placeholder={"Username"}
                    name={"username"}
                    onChange={handleChange}
                    prefix={"u/"}
                  />
                </div>
                <div className="loginpageinputs">
                  <Askinput
                    placeholder={"Password"}
                    name={"password"}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    postfix={showPassword ? "IChttps" : "ICno_encryption"}
                    onClickPostfix={() => setShowPassword(!showPassword)}
                  />
                </div>
                <button
                  className="waves-effect waves-light btn loginpagebtn black-text"
                  type="submit"
                  disabled={userData?.username?.length === 0 || userData?.password?.length === 0 ? true : false}
                >
                  <div className="loginpagebtntxt">Log In </div>
                  <i className="material-icons loginpagebtnicn">exit_to_app </i>
                </button>
              </form>
            ) : forgotUsernameLevels === 1 ? (
              <form className="loginpageform" onSubmit={logingUser}>
                <div className="loginpageinputs">
                  <Askinput
                    placeholder={"Email"}
                    name={"email"}
                    onChange={handleChange}
                  />
                </div>
                <div className="loginpageinputs">
                  <Askinput
                    placeholder={"Password"}
                    name={"password"}
                    onChange={handleChange}
                    type={"password"}
                  />
                </div>
                <button
                  className="waves-effect waves-light btn loginpagebtn black-text"
                  type="submit"
                  disabled={userData?.email?.length === 0 || userData?.password?.length === 0 ? true : false}
                >
                  <div className="loginpagebtntxt">Find Username </div>
                  <i className="material-icons right">nature_people</i>
                </button>
              </form>
            ) : forgotUsernameLevels === 2 ? (
              <form onSubmit={logingUser}>
                <div className="loginpageinputs">
                  <Askinput
                    placeholder={"Email"}
                    name={"email"}
                    onChange={handleChange}
                  />
                </div>
                <div className="loginpageinputs">
                  <Askinput
                    placeholder={"Username"}
                    name={"username"}
                    onChange={handleChange}
                  />
                </div>
                <button
                  className="waves-effect waves-light btn loginpagebtn black-text"
                  type="submit"
                  disabled={userData?.email?.length === 0 || userData?.username?.length === 0 ? true : false}
                >
                  <div className="loginpagebtntxt">Forgot Password </div>
                  <i className="material-icons right">network_locked</i>
                </button>
              </form>
            ) : forgotUsernameLevels === 7 ? (
              <form onSubmit={handleOneClickLogin}>
                <div className="loginpageinputs">
                  <Askinput
                    placeholder={"Email"}
                    name={"email"}
                    onChange={handleChange}
                  />
                </div>
                <button
                  className="waves-effect waves-light btn loginpagebtn black-text"
                  type="submit"
                  disabled={(userData?.email?.length === 0 || clicked) ? true : false}
                >
                  <div className="loginpagebtntxt"> {!clicked ? "Magic Login" : "Please wait..."} </div>
                  <img src={require("../img/meteor_rain.png")} className="magiclinkicon" alt={"magic_link_icon"} />
                </button>
              </form>
            ) : forgotUsernameLevels === 200 ? (
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
            ) : forgotUsernameLevels === 201 && (
              <div className="clicksignupbox">
                <div className="clicksignuppic">
                  <img src={logo} className="clicksignuppic" alt={"mail_pic"} />
                </div>
                <div className="clicksignuptitle">
                  Verifying
                  <div className="material-icons clicksignuptitleicn"> mail_outline </div>
                </div>
                <div className="clicksignupmetatitle">
                  You will be redirected in a jiffy...
                </div>
              </div>
            )}
          </div>
        </div>
        { forgotUsernameLevels === 0 && (
          <div className="loginbodyfooter">
            <div className="loginpageforgotpass">
              Forget your
              <div className="loginpageextrapd" onClick={() => setForgotUsernamelevels(1)}> username </div>
              or
              <div className="loginpageextrapd" onClick={() => setForgotUsernamelevels(2)}> password </div>
            </div>
            <div className="loginpagesignup">
              Start your patch!! journey
              <Link to={"/account/register"} className="loginpageextrapd">here</Link>
            </div>
          </div>
        )}
      </div>
      { error && (
        <Errorcard message={error} err={true} />
      )}
    </div >
  );
}

export default Login;
