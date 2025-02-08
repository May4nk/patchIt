import React, { useState } from 'react';

//utils
import useLoginvia from '../../utils/helpers/loginvia';
import { Randomcred } from '../../utils/helpers/helpers';

//components
import Otherlogins from './Otherlogins';
import Patbtn from '../../components/html/Patbtn';
import Askinput from '../../components/html/Askinput';

//css, constants & types
import "./login.css";
import { allNames } from '../../constants/const';
import { leveltype, signupdatatype, signuppropstype } from './types';

function Sign(signupprops: signuppropstype) {
  const { handleLoginGreetings, setError } = signupprops;

  //helpers
  const randomUsername = Randomcred("username");
  const signupAndLogin = useLoginvia("signupAndLoginUser");
  const checkEmailAndUsername = useLoginvia("isUsernameAvailable");

  //states
  const [checkError, setCheckError] = useState<string>("");
  const [signupLevel, setSignupLevel] = useState<leveltype>(0);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  //0: email verification, 1: username & password;
  const [userData, setUserData] = useState<signupdatatype>({
    email: "",
    username: "",
    consent: false,
    password: "",
    cpassword: "",
  });

  //handlers
  const handleDefault: () => void = () => {
    setUserData({ username: "", email: "", password: "", cpassword: "", consent: false });
    setSignupLevel(0);
  }

  const handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    })
  }

  const verifyEmail: (e: React.FormEvent) => Promise<void> = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData.consent) {
      setError({ status: 500, message: "Tick is required!! that you ignored", show: true });
      return;
    }

    if (userData?.email.length < 1) {
      setError({ status: 500, message: "Email is required!!", show: true });
      return;
    }

    const isEmailExists = await checkEmailAndUsername(null, userData.email);
    if (isEmailExists) {
      setError({
        status: 500,
        show: true,
        message: "Account already exists with entered email: Try logging in",
      });

      setUserData({ username: "", email: "", password: "", cpassword: "", consent: false });
      return;
    }

    setSignupLevel(1);
  }

  const handleUsernameVerification: () => Promise<void> = async () => {
    const isUsernameExists = await checkEmailAndUsername(userData?.username, null);

    if (isUsernameExists) {
      setCheckError("Username already exists, try another one");
      return;
    }

    setCheckError("");
  }

  const signingup: (e: any) => Promise<void> = async (e) => {
    e.preventDefault();
    if (checkError.length < 1) {
      if (userData?.password !== userData?.cpassword) {
        setError({ status: 500, message: "Password & confirm password don't match", show: true });
        return;
      }

      try {
        const signupData = {
          email: userData.email.trim(),
          username: userData.username.trim(),
          password: userData.password.trim(),
        }

        await signupAndLogin(signupData)
          .catch(() => {
            setSignupLevel(0);
            setError({
              show: true,
              status: 500,
              message: "Something went wrong: Account Creation failed",
            });
          });
      } catch (err) {
        setSignupLevel(0);
        setError({
          show: true,
          status: 500,
          message: "Something went wrong: Account Creation failed",
        })
      }
    }
  }

  return (
    <>
      <div className="loginpageformhead" onClick={handleDefault}>
        <div className="loginpageformheadtxt">
          Create Account
        </div>
        <div className="loginpageformheadmetatxt">
          Patch things here,
        </div>
        <div className="loginpageformheadmetatxt">
          be anonymous,
        </div>
        <div className="loginpageformheadmetatxt">
          &
        </div>
        <div className="loginpageformheadmetatxt">
          explore things.
        </div>
      </div>
      <div className="loginpageformbody">
        {signupLevel === 0 ? (
          <>
            <form className="loginpagesignuppage" onSubmit={verifyEmail}>
              <div className="loginpageinputs">
                <Askinput
                  name={"email"}
                  onChange={handleChange}
                  placeholder={"Email"}
                  value={userData?.email}
                />
              </div>
              <div className="policyuser">
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
              <div className="loginpagebtnwrapper">
                <Patbtn
                  text={"Continue"}
                  state="active"
                  type={"submit"}
                  disabled={(userData.email.length < 1 || !userData.consent)}
                />
              </div>
              <div className="trytxt">Or</div>
            </form>
            <Otherlogins
              handleLoginGreetings={handleLoginGreetings}
            />
          </>
        ) : signupLevel === 1 && (
          <form className="loginpageformloginform" onSubmit={signingup}>
            <div className="loginpageinputs">
              <Askinput
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
            {checkError.length > 1 && (
              <div className="check red-text">
                {checkError}
              </div>
            )}
            <div className="loginpageinputs">
              <Askinput
                name={"password"}
                onChange={handleChange}
                placeholder={"Password"}
                value={userData.password}
                type={showPassword ? "text" : "password"}
              />
            </div>
            <div className="loginpageinputs">
              <Askinput
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
                {showPassword ? "https" : "no_encryption"}
              </i>
            </div>
            <div className="loginpagebtnwrapper">
              <Patbtn
                text={"create"}
                size='big'
                state="active"
                type={"submit"}
                disabled={(userData?.username?.length === 0 || userData?.password?.length === 0)}
              />
            </div>
          </form>
        )}
      </div>
    </>
  )
}

export default Sign;