import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import useLoginvia from "../common/loginvia";
//components
import Askinput from "./html/Askinput";
import Errorcard from "./Errorcard";
//queries & mutations
import { LISTUSERS, SIGNUPUSER } from "../common/loginqueries";
import { UPSERTUSERPREFERENCES } from "../containers/queries/profilesetting";
//css
import "./css/login.css";
import { allNames } from "../constants/const";
import { loginproptypes, userdatatypes,usertype } from "../containers/types/logintypes.js";

const logo:string = require("../img/logo.png");
const googlelogo: string = require("../img/logo_google.png");
const anonlogo: string = require("../img/logo_anonymous.png");
const magiclogo: string = require("../img/meteor_rain_white.png");
const maillogo: string = require("../img/maillogo.png");

const Login = ({ showLogin, setShowLogin }: loginproptypes) => {
  const active:string = showLogin ? "block" : "none" ;
  const login = useLoginvia("login");
  const magiclogin = useLoginvia("magiclinkLogin");
  const googlelogin = useLoginvia("googleLogin");
  const anonlogin = useLoginvia("anonymousLogin");
  //states
  const [showSignup, setShowsignup] = useState<boolean>(false);
  const [signupLevel, setSignupLevel] = useState<number>(0);
  const [forgetLevels, setForgetLevels] = useState<number>(0);
  const [clicked, setClicked] = useState<boolean>(false);
  const [errorr, setError] = useState<string>("");
  const [consent, setConsent] = useState<boolean>(false);
  const [checkError, setCheckError] = useState<string>("");
  const [userData, setUserData] = useState<userdatatypes>({ username: "", password: "", email: "" });
  const [forgotData, setForgotData] = useState({ forgotemail: "", forgotusername: "", forgotpassword: "" });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { email, ...loginData }: userdatatypes = userData; //login data: userData without email
  //queries & mutations
  const [signupuser, { error: signupError }] = useMutation(SIGNUPUSER); 
  const [createuserpreference] = useMutation(UPSERTUSERPREFERENCES);
  const [getAllUsers, { data, loading}] = useLazyQuery(LISTUSERS);
  
  //getting random username 
  const getRandomUsername: (unames: string[]) => string = (unames) => {
    const createUsername = unames[Math.floor(Math.random()*3)]+Math.floor(Math.random()*9);
    return createUsername;
  }
  
  //handlers
  const signingup: (e: any) => void = (e) => {
    e.preventDefault();
    if(showSignup) {
      if(checkError.length < 1) {
        signupuser({
          variables: {
            data: userData
          },
          onError: () => {
            setSignupLevel(0);
          },
          onCompleted: ({ insertUser }: { insertUser: usertype}) => {
            if(insertUser) {
              createuserpreference({
                variables: {
                  data: { user_id: insertUser.id }
                }
              }).then(() => {
                setShowsignup(false);
              })
            }
          }
        });
      }
    } else {
      login(loginData).catch((err: string) => {
        setError(err);
      });
    }
  } 

  const handleGoogleLogin:() => void = () => {
    try {
      googlelogin();
    } catch(err: any) {
      setError(err.message);
    }
  }

  const handleFocus: () => void = () => {
    if(userData?.username && userData?.username.length > 3) {
      let checkUsername = !loading && data?.listUsers?.filter((user: usertype ) => (
        user?.username.includes(userData?.username!?.toLowerCase())
      ));

      if(checkUsername?.length >= 1) {
        setCheckError(`User with username "${ checkUsername[0].username }" already exist.`)
      } else {
        setCheckError("");
      }
    } else {
      setCheckError("Username should be 4-17 letters")
    }
  }

  const handleMagiclogin = async(e: React.FormEvent) => {
    e.preventDefault();
    setClicked(true);
    const mailSent = await magiclogin(userData.email);
    if(mailSent.status === 200) {
      setSignupLevel(202);
    }
  }
   
  const handleChange: (e: any) => void = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    })
  }

  const handleForgetChange: (e: any) => void = (e) => {
    setForgotData({
      ...forgotData,
      [e.target.name]: e.target.value
    })
  }

  const handleSignupDefault: () => void = () => {
    setSignupLevel(0);
    setForgetLevels(0);
    setConsent(false);
    setShowsignup(!showSignup);
    setClicked(false);
    setShowPassword(false);
    setUserData({ username: "", password: "", email: "" });
    setForgotData({ forgotemail: "", forgotusername: "", forgotpassword: "" });
  }

  const magicLogin:() => void = () => {
   handleSignupDefault();
   setShowsignup(true);
   setSignupLevel(201);   
  }
 
  const closeLogin: () => void = ()  => {
    setUserData({ username: "", password: "", email: "" });
    setForgotData({ forgotemail: "", forgotusername: "", forgotpassword: "" });
    setSignupLevel(0);
    setForgetLevels(0);
    setConsent(false);
    setShowsignup(false);
    setShowLogin(false);
    setClicked(false);
    setShowPassword(false);
  }

  useEffect(() => {
    if(showSignup && userData?.username && userData?.username?.length > 4) {
      getAllUsers();
    }
  },[userData?.username, showSignup]);
  
  return (
    <div className={ active }>
      <div className="overlay" >
        <div className="loginbox">
          <i className="material-icons closeicn" onClick={ closeLogin }> close </i>
          <div className="logincardlogowrapper">
            <img src={ logo } className="logincardlogo" alt={"patch_logo"}/>
          </div>
          <div className="logincontent">
            <div className="logincardtitle">
              <div className="blue-text">
                { showSignup ?
                    signupLevel === 1 ? "Sign Up" :
                    signupLevel === 201 && "Magic Login"
                  :
                    forgetLevels === 0 ? "Log In" :
                    forgetLevels === 1 ? "Find Username" :
                    forgetLevels === 2 && "Forget password"
                } 
              </div>
              {((showSignup && (signupLevel !== 0 || signupLevel > 201)) || (!showSignup && forgetLevels !== 0)) && (
                <i className="material-icons logincardtitleicn"
                  onClick={ showSignup ? () => setSignupLevel(0) : () => setForgetLevels(0) }
                > 
                  arrow_back 
                </i>
              )}
            </div>
            {((showSignup && signupLevel !== 0) || (!showSignup && forgetLevels !== 0)) && (
              <div className="extraspace"> </div>
            )}
            <form className="form">
              { showSignup ? (
                signupLevel === 0 ? (
                  <div className="loginforminp">
                    <Askinput
                      name={"email"}
                      onChange={ handleChange }
                      placeholder={"Email"}
                      value={ userData?.email }
                    />
                  </div>
                ) : signupLevel === 1 ? (
                  <>
                    <div className="loginforminp">
                      <Askinput
                        name={"username"}
                        onChange={ handleChange }
                        placeholder={"Username" }
                        prefix={"u/"}
                        postfix={ "ICimport_export" }
                        onClickPostfix={ () => setUserData({ ...userData, username: getRandomUsername(allNames)}) }
                        value={ userData.username }
                        onBlur={ handleFocus }
                      />
                    </div>
                    { checkError.length > 1 && (
                      <div className="check red-text">
                        { checkError }
                      </div>
                    )}
                    <div className="loginforminp">
                      <Askinput
                        type={ "password" }
                        name={ "password" }
                        onChange={ handleChange }
                        placeholder={"Password"}
                        value={ userData.password }
                      />
                    </div>
                  </>
                ) : signupLevel === 201 ? (
                  <div className="loginforminp">
                    <Askinput
                      name={"email"}
                      onChange={ handleChange }
                      placeholder={"Email"}
                      value={ userData.email }
                    />
                  </div>
                ) : signupLevel === 202 && (
                  <div className="magicloginscreen">
                    <img src={ maillogo } alt={"mail_logo"} className="mailpic" />
                    <div className="senttext">
                      Click on sent mail to verify & login yourself
                    </div>
                  </div>
                )
              ) : (
                forgetLevels === 0 ? (
                  <>
                    <div className="loginforminp">
                      <Askinput
                        name={"username"}
                        onChange={ handleChange }
                        placeholder={"Username" }
                        prefix={"u/"}
                        value={userData.username}
                      />
                    </div>
                    <div className="loginforminp">
                      <Askinput
                        type={ showPassword ? "text" : "password" }
                        name={"password"} 
                        onChange={ handleChange }
                        placeholder={"Password"}
                        value={ userData.password }
                        postfix={showPassword ? "IChttps" : "ICno_encryption" }
                        onClickPostfix={() => setShowPassword(!showPassword)}
                      />
                    </div>
                  </>
                ) : forgetLevels === 1 ? (
                  <>
                    <div className="loginforminp">
                      <Askinput
                        name={"forgotemail"}
                        onChange={ handleForgetChange }
                        placeholder={"Email" }
                        value={ forgotData.forgotemail}
                      />
                    </div>
                    <div className="loginforminp">
                      <Askinput
                        type={"password"}
                        name={"forgotpassword"}
                        onChange={ handleForgetChange }
                        placeholder={"Password"}
                        value={ forgotData.forgotpassword}
                      />
                    </div>
                  </>
                ) : forgetLevels === 2 && (
                  <>
                    <div className="loginforminp">
                      <Askinput
                        name={"forgotusername"}
                        onChange={ handleForgetChange }
                        placeholder={"Username" }
                        prefix={"u/"}
                        value={ forgotData.forgotusername}
                      />
                    </div>
                    <div className="loginforminp">
                      <Askinput
                        name={"forgotemail"} 
                        onChange={ handleForgetChange }
                        placeholder={"Email" }
                        value={ forgotData.forgotemail}
                      />
                    </div>
                  </>
                )
              )}
              <div className={ (showSignup || forgetLevels === 1 || forgetLevels === 2) ? "none" : "forgotpass" }>
                Forget your 
                <span className="fpassword" onClick={() => setForgetLevels(1) }> username </span>
                or
                <span className="fpassword" onClick={() => setForgetLevels(2) }> password </span> 
                ?
              </div>
              {(showSignup && signupLevel === 0) && (
                <div className="policy"> 
                  <label className="block">
                    <input
                      type="checkbox"
                      name="terms"
                      required
                      onChange={ () => setConsent(!consent) }
                      checked={ consent }
                    />
                    <span className="policytxt">
                      By checking, you agree on setting up a Patch! account and agree to our User Agreement and Privacy Policy. 
                    </span>
                  </label>
                </div>
              )}
              { !showSignup ? (
                forgetLevels === 0 ? (
                  <button 
                    id="mybtn"
                    className="btn waves-effect waves-light"
                    disabled={ (userData?.username && userData?.password) ? false : true }
                    type="submit"
                    onClick={ signingup }
                  >
                    Login
                  </button>
                ) : forgetLevels === 1 ? (
                  <button 
                    id="mybtn"
                    className="btn waves-effect waves-light"
                    disabled={ (forgotData?.forgotemail && forgotData?.forgotpassword) ? false : true }
                    type="submit"
                  >
                    Find
                  </button>
                ) : forgetLevels === 2 && (
                  <button 
                    id="mybtn"
                    className="btn waves-effect waves-light"
                    disabled={ (forgotData?.forgotemail && forgotData?.forgotusername) ? false : true }
                    type="submit"
                  >
                    Forget
                  </button>
                )
              ) : (
                signupLevel === 0 ? (
                  <button 
                    id="mybtn"
                    className="btn waves-effect waves-light"
                    disabled={ (userData.email && consent) ? false : true }
                    onClick={ () => setSignupLevel(signupLevel + 1) }
                  >                  
                    Continue
                  </button>
                ) : signupLevel === 1 ? (
                  <button 
                    id="mybtn"
                    className="btn waves-effect waves-light"
                    disabled={ (userData?.username && userData?.password && userData?.email) ? false : true }
                    type="submit"
                    onClick={ signingup }
                  >
                    Signup
                  </button>
                ) : signupLevel === 201 && (
                  <button 
                    id="magicbtn"
                    className="btn waves-effect waves-light"
                    disabled={(userData?.email!.length === 0 || clicked) ? true : false}
                    type="submit"
                    onClick={ (e) => handleMagiclogin(e) }
                  >
                    <img src={ magiclogo } className="magiclinkbtnicon" alt={"magiclink_logo"} />
                    { !clicked ? "Magic Login" : "Please Wait..." }
                  </button>
                )
              )}
              {(showLogin && (signupLevel === 0 && forgetLevels === 0)) && (
                <div className="signup">
                  { showSignup ? "Already on Patch!! ?" : "New to Patch!!" }
                  <span className="signupbtn" onClick={ handleSignupDefault }>
                    { showSignup ? "Continue" : "Start here"}
                  </span>
                </div>
              )}
            </form>
          </div>
          {(signupLevel < 1 && forgetLevels === 0) && (
            <div className="ortxt">
              Or
            </div>
          )}
          {(signupLevel === 0 && forgetLevels === 0) && (
            <div className="otherformlogin">
              <div 
                className="loginotherform waves-effect waves-light"
                title="One Click login"
                onClick={ magicLogin }
              >
                <img src={ magiclogo } className="magiclinkicon" alt={"magic_logo"} />
                <div> Magin login </div>
              </div>
              <div 
                className="loginotherform waves-effect waves-light"
                title="Anonymous login"
                onClick={() => anonlogin()}
              >
                <img src={ anonlogo } className="loginformslogo" alt={"anonmyous_logo"}/>
                <div> Anonymous </div>
              </div>
              <div 
                className="loginotherform waves-effect waves-light"
                title="Google login"
                onClick={ handleGoogleLogin } 
              >
                <img src={ googlelogo } className="loginformslogo" alt={"google_logo"}/>
                <div> oogle </div>
              </div>
            </div>
          )}
          {(!showSignup || signupLevel === 1 || signupLevel === 201) && (
            <div className="tc">
              You have already agreed to Patch!! terms & conditions.
            </div>
          )}
        </div>
      </div>
      {(errorr || signupError) && (
        <Errorcard message={ errorr || signupError?.message } err={ true } />
      )}
    </div>
  )
}

export default Login;
