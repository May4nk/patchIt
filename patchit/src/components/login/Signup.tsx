import React, { useState } from 'react';

import useLoginvia from '../../utils/loginvia';
import { Randomcred } from '../../utils/helpers';

//components
import Askinput from '../html/Askinput';

//css, types, images & constants
import "./loginbox.css";
import { signuppropstype } from './types';
import { allNames } from '../../constants/const';

function Signup(signupprops: signuppropstype) {
  const { handleChange, userData, setUserData, setError, error, closeLogin } = signupprops;

  const randomUsername = Randomcred("username");
  const isUsernameExist = useLoginvia("isUsernameAvailable");
  const signupAndLogin = useLoginvia("signupAndLoginUser");

  //states   
  const [signupLevel, setSignupLevel] = useState<number>(0); //levels 0: default, 1: after entering mail

  //handlers
  const handleFocus: (check: string) => Promise<void> = async (check) => {
    if (check === "email") {
      if (userData?.email.length < 3 && userData?.email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )) {
        setError(`Email should be valid`)
      }

      let emailExists: boolean = await isUsernameExist(null, userData.email);

      if (emailExists) {
        setError(`User with email "${userData.email}" already exist.`)
      } else {
        setError("");
      }

    } else if (check === "username") {
      if (userData?.username.length > 3) {
        let usernameExists = await isUsernameExist(userData.username);

        if (usernameExists) {
          setError(`User with username "${userData.username}" already exist.`)
        } else {
          setError("");
        }
      } else {
        setError(`Username should be 4-17 letters`)
      }
    }
  }

  const handleSignup: (e: any) => Promise<void> = async (e: any) => {
    e.preventDefault();
    if (userData.password !== userData.confirm_password) {
      setError("Entered Passwords don't match");
      return;
    }

    try {
      const signupData = {
        email: userData.email.trim(),
        username: userData.username.trim(),
        password: userData.password.trim(),
      }

      await signupAndLogin(signupData);
      closeLogin();
    } catch (err) {
      setError("Something went wrong: User Signup failed");
    }
  }

  return (
    <form className="form">
      {signupLevel === 0 ? (
        <>
          <div className="loginforminp">
            <Askinput
              name={"email"}
              placeholder={"Email"}
              onChange={handleChange}
              value={userData?.email}
              onBlur={() => handleFocus("email")}
            />
          </div>
        </>
      ) : signupLevel === 1 && (
        <>
          <div className="loginforminp">
            <Askinput
              prefixes={["u/"]}
              name={"username"}
              onChange={handleChange}
              placeholder={"Username"}
              value={userData.username}
              postfix={"ICimport_export"}
              onBlur={() => handleFocus("username")}
              onClickPostfix={() => setUserData({ ...userData, username: randomUsername(allNames) })}
            />
          </div>
          <div className="loginforminp">
            <Askinput
              type={"password"}
              name={"password"}
              onChange={handleChange}
              placeholder={"Password"}
              value={userData.password}
            />
          </div>
          <div className="loginforminp">
            <Askinput
              type={"password"}
              name={"confirm_password"}
              onChange={handleChange}
              placeholder={"Confirm Password"}
              value={userData.confirm_password}
            />
          </div>
        </>
      )}
      {signupLevel === 0 && (
        <div className="policy">
          <label className="block">
            <input
              required
              name="terms"
              type="checkbox"
              checked={userData?.consent}
              onChange={() => setUserData({ ...userData, consent: !userData.consent })}
            />
            <span className="policytxt">
              By checking, you agree on setting up a Patch! account and agree to our User Agreement and Privacy Policy.
            </span>
          </label>
        </div>
      )}
      {signupLevel === 0 ? (
        <button
          id="modalloginbtn"
          onClick={() => setSignupLevel(1)}
          className="btn waves-effect waves-light"
          disabled={(userData.email && userData.consent && error.length < 1) ? false : true}
        >
          Continue
        </button>
      ) : signupLevel === 1 && (
        <button
          type="submit"
          id="modalloginbtn"
          onClick={handleSignup}
          className="btn waves-effect waves-light"
          disabled={(userData?.username && userData?.password && userData?.email) ? false : true}
        >
          Signup
        </button>
      )}
    </form>
  )
}

export default Signup;