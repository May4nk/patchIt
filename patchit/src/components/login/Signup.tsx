import React, { useState } from 'react';

//utils
import useLoginvia from '../../utils/helpers/loginvia';
import { Randomcred } from '../../utils/helpers/helpers';

//components
import Patbtn from '../html/Patbtn';
import Askinput from '../html/Askinput';

//css, types, & constants
import "./loginbox.css";
import { signuppropstype } from './types';
import { allNames } from '../../constants/const';
import { signupdatatype } from '../../containers/Login/types';
import { ASYNCVOIDFUNC, VOIDFUNC } from '../../utils/main/types';

function Signup(signupprops: signuppropstype) {
  const { setError, error, closeLogin } = signupprops;

  const randomUsername = Randomcred("username");
  const isUsernameExist = useLoginvia("isUsernameAvailable");
  const signupAndLogin = useLoginvia("signupAndLoginUser");

  //states   
  //levels 0: email, 1: username & password
  const [signupLevel, setSignupLevel] = useState<number>(0);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [userData, setUserData] = useState<signupdatatype>({
    username: "",
    password: "",
    email: "",
    consent: false,
    cpassword: ""
  });

  //handlers
  const handleChange: VOIDFUNC = (e: any) => {
    setUserData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  const handleDefault: VOIDFUNC = () => {
    setSignupLevel(0);
    setShowPassword(false);
    setUserData({
      username: "",
      password: "",
      email: "",
      consent: false,
      cpassword: ""
    });
  }

  const handleUsernameVerification: ASYNCVOIDFUNC = async () => {
    // if (check === "email") {
    //   if (userData?.email.length < 3 && userData?.email.match(
    //     /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    //   )) {
    //     setError(`Email should be valid`)
    //   }    
    if (userData?.username.length > 3) {
      let usernameExists = await isUsernameExist(userData.username, null);

      if (usernameExists) {
        setError({ status: 500, message: `User with username "${userData.username}" already exist.`, show: true });
      } else {
        setError({ status: 0, message: "", show: false });
      }
    } else {
      setError({ status: 500, message: "Username should be 4-17 letters", show: true });
    }
  }

  const verifyEmail: ASYNCVOIDFUNC = async () => {
    const emailExists: boolean = await isUsernameExist(null, userData.email);

    if (emailExists) {
      setError({ status: 500, message: "Account with email already exists, try login", show: true });
      return;
    } else {
      setError({ status: 0, message: "", show: false });
    }

    setSignupLevel(1);
  }

  const handleSignup: ASYNCVOIDFUNC = async (e: any) => {
    e.preventDefault();
    if (userData.password !== userData.cpassword) {
      setError({ status: 500, message: "Entered Passwords don't match", show: false });
      return;
    }

    try {
      const signupData = {
        email: userData.email.trim(),
        username: userData.username.trim(),
        password: userData.password.trim(),
      }

      await signupAndLogin(signupData);
      handleDefault();
      closeLogin();
    } catch (err) {
      setError({ status: 500, message: "User Signup failed: Try again", show: false });
    }
  }

  return (
    <>
      {signupLevel === 0 ? (
        <>
          <div className="loginforminp">
            <Askinput
              required={true}
              name={"email"}
              placeholder={"Email"}
              onChange={handleChange}
              value={userData?.email}
            />
          </div>
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
          <div className="loginbtnwrapper">
            <Patbtn
              text={"continue"}
              state={"active"}
              handleClick={verifyEmail}
              disabled={(userData.email && userData.consent && !error.show) ? false : true}
            />
          </div>
        </>
      ) : signupLevel === 1 && (
        <form className="form" onSubmit={handleSignup}>
          <div className="loginforminp">
            <Askinput
              required={true}
              prefixes={["u/"]}
              name={"username"}
              onChange={handleChange}
              placeholder={"Username"}
              value={userData.username}
              postfix={"ICimport_export"}
              onBlur={handleUsernameVerification}
              onClickPostfix={() => setUserData({ ...userData, username: randomUsername(allNames) })}
            />
          </div>
          <div className="loginforminp">
            <Askinput
              required={true}
              name={"password"}
              onChange={handleChange}
              placeholder={"Password"}
              value={userData.password}
              type={showPassword ? "text" : "password"}
            />
          </div>
          <div className="loginforminp">
            <Askinput
              required={true}
              name={"cpassword"}
              onChange={handleChange}
              value={userData.cpassword}
              placeholder={"Confirm Password"}
              type={showPassword ? "text" : "password"}
            />
          </div>
          <div className="signupshowpwd" onClick={() => setShowPassword(prev => !prev)}>
            (show password)
            <i className="material-icons signupshowpwdicn">
              {showPassword ? "no_encryption" : "https"}
            </i>
          </div>
          <div className="loginbtnwrapper">
            <Patbtn
              text={"Sign up"}
              state={"active"}
              type={"submit"}
              handleClick={verifyEmail}
              disabled={(userData?.username && userData?.password && userData?.email) ? false : true}
            />
          </div>
        </form>
      )}
    </>
  )
}

export default Signup;