import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

//types, pics & css
import "./login.css";
import { greetingpropstype, loginpagelevels } from './types';
import Patbtn from '../../components/html/Patbtn';
const logo: string = require("../../img/logo.png");

function Greetings(greetingprops: greetingpropstype) {
  const { loginLevel, setLoginLevel, move, handleLoginGreetings } = greetingprops;

  //states
  const [type, setType] = useState<boolean>(false);

  //handlers
  const handleGreetings: (level: loginpagelevels) => void = (level: loginpagelevels) => {
    handleLoginGreetings(level);

    setTimeout(() => {
      setLoginLevel(level);
      setType(true);
    }, 300);
  }

  useEffect(() => {
    setType(true);
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setType(false);
    }, 5000)
  }, [type])

  return (
    <div className={`loginpagegreetings ${move ? "glock" : ""}`}>
      <Link className="loginpagegreetinglogowrapper" to={"/c/popular"}>
        <img className="loginpagegreetinglogo" src={logo} alt="logo" />
      </Link>
      <div className="loginpagegreetingsbody">
        <div className="loginpagegreetingcontent">
          <div className={`loginpagegreetingbodytxt ${type ? "animatable" : ""}`}>
            {loginLevel === 0
              ? "Hello friend..."
              : loginLevel === 1
                ? "Keep patching..."
                : loginLevel === 3
                  ? "Can't remember Password..."
                  : loginLevel === 4
                    ? "Got your back jack..."
                    : loginLevel === 5
                      ? "Feeling light now?"
                      : loginLevel === 7
                        ? "Tired of passwords?"
                        : loginLevel === 8
                          ? "Just One Click away..."
                          : loginLevel === 9
                          && "Verifying! Wait a bit..."
            }
          </div>
          <div className={`loginpagegreetingbodymetatxt ${type ? "animatable" : ""}`}>
            {loginLevel === 0
              ? "Start your patch journey here"
              : loginLevel === 1
                ? "Keep Moving, Continue your journey here"
                : loginLevel === 3
                  ? "Seems you need more bamboo sticks to chew."
                  : loginLevel === 4
                    ? "Just click on sent link and change it"
                    : loginLevel === 5
                      ? "Now continue your journey"
                      : loginLevel === 7
                        ? "Click to get login instantly..."
                        : loginLevel === 8
                          ? "check your email to login instantly"
                          : loginLevel === 9
                          && "Hello friend..."
            }
          </div>
          <div className="loginpagebtnwrapper">
            <Patbtn
              handleClick={
                () => loginLevel === 0 ? handleGreetings(1) : handleGreetings(0)
              }
              state={"active"}
              text={
                loginLevel === 0
                  ? "Create account"
                  : loginLevel >= 3
                    ? "back to login"
                    : "Sign in"
              }
            />
          </div>
        </div>
      </div>
    </div >
  )
}

export default Greetings;