import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";

import useLoginvia from "../../utils/loginvia";
import { useAuth, useLogged } from "../../utils/hooks/useAuth";

//components
import Otherlogins from "./Otherlogins";
import Errorcard from "../../components/cards/Errorcard";
import Askinput from "../../components/html/Askinput";

//queries
import { GETMAGICTOKENUSER } from "../../utils/loginqueries";

//css, types & images
import "./login.css";
import { userdatatypes, magictokenusertype } from "./types.js";
import { authcontexttype, loggedusercontexttype, loginusertype } from "../../context/types.js";
import { ERRORTYPE } from "../../utils/main/types";
const logo: string = require("../../img/logo.png");
const mailpic: string = require("../../img/maillogo.png");
const magiclogo: string = require("../../img/meteor_rain.png");

const Login = () => {
  const navigate = useNavigate();
  const { verifycode } = useParams();

  const login = useLoginvia("login");
  const magiclogin = useLoginvia("magiclinkLogin");

  const auth: authcontexttype = useAuth();
  const { updateLoggedUser }: loggedusercontexttype = useLogged();

  //queries
  const [verifyMagicToken] = useLazyQuery(GETMAGICTOKENUSER);

  //states
  const [error, setError] = useState<ERRORTYPE>({ status: 0, message: "", show: false });
  const [clicked, setClicked] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // forgot levels 0: default, 1: forgot username, 2: forgot password, 7: magiclink login, 8: magic mail sent, 9: verify magic mail
  const [forgotUsernameLevels, setForgotUsernamelevels] = useState<number>(0);
  const [userData, setUserData] = useState<userdatatypes>({
    email: "",
    username: "",
    password: "",
  });

  //handlers   
  const handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    })
  }

  const handleMagicLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setClicked(true);

      await magiclogin(userData.email)
        .then(() => {
          setError({ status: 0, message: "", show: false });
          setClicked(false);
          setForgotUsernamelevels(8);
        }).catch((err) => {
          setClicked(false);
          setError(err.message);
          setUserData({ username: "", password: "", email: "" });
        });

    } catch (err) {
      setError({ status: 500, message: "Something went wrong: Magic Login failed", show: true });
    }
  }

  const logingUser: (e: React.FormEvent) => void = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const { username, password } = userData;
      if (username?.length > 0 && password?.length > 0) {
        const { email, ...loginData } = userData;

        await login(loginData)
          .catch((err: string) => {
            setError({ status: 500, message: "Check out your credentials: Login failed", show: true })
          });
      }
    } catch (err) {
      setError({ status: 500, message: "Something went wrong: Login failed", show: true });
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    //code here
  }

  useEffect(() => {
    if (auth.user !== null) {
      navigate("/home");
    }

    if (verifycode && verifycode?.length > 0) {
      try {
        setForgotUsernamelevels(9);
        verifyMagicToken({
          variables: {
            token: verifycode!
          },
          onCompleted: ({ verifyMagicToken }: { verifyMagicToken: magictokenusertype }) => {
            if (verifyMagicToken) {
              const tokenUser: magictokenusertype = verifyMagicToken;
              const loggedinData: loginusertype = {
                id: tokenUser.id,
                token: tokenUser.token,
                email: tokenUser.email,
                role: tokenUser.role.id,
                username: tokenUser.username,
                new_user: tokenUser.new_user,
              };

              auth.login(loggedinData);
              updateLoggedUser({ new_user: loggedinData?.new_user });
              !loggedinData?.new_user
                ? navigate("/home")
                : navigate(`/u/${loggedinData?.username!}`);
            }
          },
          onError: (err) => {
            setError({ status: 500, message: "Something went wrong: Magic Login verification failed", show: true });
            setInterval(() => {
              navigate("/home");
            }, 3000);
          }
        })
      } catch (err) {
        setError({ status: 500, message: "Something went wrong: Magic Login verification failed", show: true });
      }
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
            {forgotUsernameLevels === 0 ?
              "Log in"
              : forgotUsernameLevels === 1 ?
                "Forgot Username?"
                : forgotUsernameLevels === 2 ?
                  "Forgot Password?"
                  : forgotUsernameLevels === 7 &&
                  "Tired of passwords?"
            }
          </div>
          <div className="loginpagemetatitle">
            {forgotUsernameLevels === 1 ?
              "try login through your email."
              : forgotUsernameLevels === 2 ?
                "Get your password reset link in your mail"
                : forgotUsernameLevels === 7 &&
                "Get a magic link on your mail, click on sent link to log in or sign up instantly."
            }
          </div>
        </div>
        <div className="loginbodycontent">
          {forgotUsernameLevels < 7 && (
            <>
              <div className="loginbodycontentheader">
                <Otherlogins
                  setForgotUsernamelevels={setForgotUsernamelevels}
                />
              </div>
              <div className="ortxt">
                Or
              </div>
            </>
          )}
          <div className="loginbodycontentbody">
            {forgotUsernameLevels === 0 ? (
              <form className="loginpageform" onSubmit={logingUser}>
                <div className="loginpageinputs">
                  <Askinput
                    prefixes={["u/"]}
                    name={"username"}
                    onChange={handleChange}
                    placeholder={"Username"}
                  />
                </div>
                <div className="loginpageinputs">
                  <Askinput
                    name={"password"}
                    placeholder={"Password"}
                    onChange={handleChange}
                    value={userData.password}
                    type={showPassword ? "text" : "password"}
                    postfix={showPassword ? "IChttps" : "ICno_encryption"}
                    onClickPostfix={() => setShowPassword(!showPassword)}
                  />
                </div>
                <button
                  type="submit"
                  className="waves-effect waves-light btn loginpagebtn black-text"
                  disabled={userData?.username?.length === 0 || userData?.password?.length === 0 ? true : false}
                >
                  Log In
                </button>
              </form>
            ) : forgotUsernameLevels === 1 ? (
              <form className="loginpageform" onSubmit={logingUser}>
                <div className="loginpageinputs">
                  <Askinput
                    name={"email"}
                    placeholder={"Email"}
                    value={userData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="loginpageinputs">
                  <Askinput
                    name={"password"}
                    type={"password"}
                    onChange={handleChange}
                    placeholder={"Password"}
                    value={userData.password}
                  />
                </div>
                <button
                  type="submit"
                  className="waves-effect waves-light btn loginpagebtn black-text"
                  disabled={userData?.email?.length === 0 || userData?.password?.length === 0 ? true : false}
                >
                  Log In
                </button>
              </form>
            ) : forgotUsernameLevels === 2 ? (
              <form className="loginpageform" onSubmit={handleForgotPassword}>
                <div className="loginpageinputs">
                  <Askinput
                    name={"email"}
                    placeholder={"Email"}
                    value={userData.email}
                    onChange={handleChange}
                  />
                </div>
                <button
                  type="submit"
                  disabled={userData?.email?.length === 0 ? true : false}
                  className="waves-effect waves-light btn loginpagebtn black-text"
                >
                  Forgot Password
                </button>
              </form>
            ) : forgotUsernameLevels === 7 ? (
              <form className="loginpageform" onSubmit={handleMagicLogin}>
                <div className="loginpageinputs">
                  <Askinput
                    name={"email"}
                    placeholder={"Email"}
                    onChange={handleChange}
                    value={userData?.email}
                  />
                </div>
                <button
                  type="submit"
                  className="waves-effect waves-light btn loginpagebtn black-text"
                  disabled={(userData?.email?.length === 0 || clicked) ? true : false}
                >
                  <img src={magiclogo} className="magiclinkicon" alt={"magic_link_icon"} />
                  {!clicked ? "Login" : "Sending"}
                  {clicked && (
                    <i className="material-icons magiclinkicon"> email </i>
                  )}
                </button>
              </form>
            ) : forgotUsernameLevels === 8 ? (
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
            ) : forgotUsernameLevels === 9 && (
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
        </div>
        {forgotUsernameLevels === 0 && (
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
      {error && (
        <Errorcard message={error} />
      )}
    </div >
  );
}

export default Login;
