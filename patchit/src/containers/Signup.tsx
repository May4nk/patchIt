import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";

import { Randomcred } from "../common/helpers";
import useLoginvia from "../common/loginvia";

import { LISTUSERS, SIGNUPUSER, UPSERTUSERPREFERENCE } from "../common/loginqueries"; //mutations

//component
import Askinput from "../components/html/Askinput";
import Errorcard from "../components/Errorcard";

//css
import "./css/login.css";
import { allNames } from "../constants/const";
import { userdatatypes, usertype } from "./types/logintypes.js";

const pic: string = require("../img/loginpagepic.jpg");
const logo: string = require("../img/logo.png");
const googlelogo: string = require("../img/logo_google.png");

const Signup = () => { 
  let navigate = useNavigate();
  const googlelogin = useLoginvia("googleLogin");
  const randomUsername: any = Randomcred("username");

  const [level, setLevel] = useState<number>(1);  
  const [checkError, setCheckError] = useState<string>("");
  const [userData, setUserData] = useState<userdatatypes>({ username: "", password: "", email: "" });
 
  const [signupuser, { error }] = useMutation(SIGNUPUSER);
  const [createuserpreference] = useMutation(UPSERTUSERPREFERENCE);
  const [getUsers, { data, loading}] = useLazyQuery(LISTUSERS);
   
  //handlers
  const signingup: (e: any) => void = (e) => {
    e.preventDefault();
    if(checkError.length < 1) {
      signupuser({ 
        variables: { 
          data: userData
        },
        onError: () => {
          setLevel(1);
        },
        onCompleted : ({ insertUser }: { insertUser: usertype}) => {
          if(insertUser) {
            createuserpreference({
              variables: {
                data: {
                  user_id: insertUser.id
                }
              }
            }).then(() => {
              navigate(`/account/login`);
            })
          }
        }
      })
    }
  }
  
  const handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    })
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

  useEffect(() => {
    if(userData?.username && userData?.username?.length > 4) {
      getUsers();
    } 
  },[userData?.username]);

  return (  
    <div className="loginpage">
      <div className="loginpagepicwrapper"> 
        <img src={ pic } className="loginpagepic" alt={"signup_pic"}/>
      </div>
      <div className="signuppagecontent"> 
        <Link to={"/c/popular"}>          
          <img src={ logo } className="loginpagelogopic" alt={"patch_logo"}/>                 
        </Link>
        <div className="loginpagetitle">Sign up </div>
        <div className="loginpagemetatitle">
          You are setting up a Patch account and agreeing to our Privacy Policy.
        </div>
        { level === 1 ? (
          <div className="loginpageformwrapper"> 
            <div className="loginthrough">
              <div className="waves-effect waves-light loginthroughbtn" onClick={() => googlelogin() }>
                <div className="googlelogoicnwrapper">
                  <img src={ googlelogo } className="googlelogoicn" alt={"google_logo"}/>  
                </div>
                oogle
              </div>
              <div className="waves-effect waves-light loginthroughbtn">
                <img src={require("../img/meteor_rain_white.png")} className="magiclinklogo" alt={"magic_link_icon"}/>
                Magic login
              </div>
            </div>
            <div className="loginpageextra">
              OR
            </div>     
            <div className="signupformwrapper">
              <div className="loginpageinputs">
                <Askinput placeholder={"Email"} name={"email"} onChange={ handleChange } value={ userData?.email }/>
              </div>
              <button className="waves-effect waves-light btn loginpagebtn black-text blue-grey lighten-1" disabled={ userData?.email?.length === 0 ? true : false } onClick={ () => setLevel(2) }>
                Continue
              </button>
            </div>
          </div>        
        ) : level === 2 && (
          <div className="signuppagel2">
            <div className="signuppageback">
              <i className="material-icons" onClick={ () => setLevel(1) }>
                arrow_back
              </i>
            </div>
            <div className="signupformwrapper">
              <form className="loginpageform" onSubmit={ signingup }>
                <div className="loginpageinputs">
                  <Askinput 
                    placeholder={ "Username" } 
                    name={ "username" } 
                    prefix={ "u/" } 
                    postfix={ "ICimport_export" } 
                    onClickPostfix={ () => setUserData({ ...userData, username: randomUsername(allNames)}) } 
                    value={ userData.username } 
                    onChange={ handleChange }
                    onBlur={ handleFocus }
                  />
                </div>
                { checkError.length > 1 && (
                  <div className="check red-text">
                    { checkError }
                  </div>
                )}
                <div className="loginpageinputs">
                  <Askinput 
                    placeholder={"Password"} 
                    type={"password"} 
                    name={"password"} 
                    onChange={ handleChange }
                  />
                </div>
                <button className="waves-effect waves-light btn black-text loginpagebtn" type="submit">
                  <i className="material-icons loginpagebtnicn">exit_to_app</i>
                  <div className="loginpagebtntxt">Sign In</div>
                </button>
              </form>
            </div>
          </div>
        )}
        <div className="loginpagesignup">
          Continue your ongoing journey
          <Link to={"/account/login"} className="loginpageextrapd">here</Link>
        </div>
        { error && (
          <Errorcard message={ error.message } err={true} />
        )}
      </div>
    </div>
  );
}


export default Signup;
