import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//utils
import useLoginvia from '../../utils/helpers/loginvia';

//components
import Otherlogins from './Otherlogins';
import Patbtn from '../../components/html/Patbtn';
import Askinput from '../../components/html/Askinput';

//css & types
import "./login.css";
import { logindatatype, loginpropstype } from './types';
import { loggedinuserdatatype } from '../../utils/types';

function Log(loginprops: loginpropstype) {
  const { setError, handleLoginGreetings } = loginprops

  //helpers
  const navigate = useNavigate();
  const login = useLoginvia("login");

  //states
  const [emailLogin, setEmailLogin] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginData, setLoginData] = useState<logindatatype>({ email: "", username: "", password: "" });

  //handlers
  const handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    })
  }

  const loginUser: (e: React.FormEvent) => void = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      let loginUserData: logindatatype | undefined;

      if (!emailLogin && loginData?.username) {
        loginUserData = {
          username: loginData.username.trim(),
          password: loginData.password.trim(),
        }
      } else if (emailLogin && loginData?.email) {
        loginUserData = {
          email: loginData.email.trim(),
          password: loginData.password.trim(),
        }
      }

      if (!loginUserData) {
        setError({ status: 500, message: "Username/Email & password is required", show: true });
        return;
      }

      await login(loginUserData)
        .then((data: loggedinuserdatatype) => {
          if (data) {
            if (!data?.new_user) {
              navigate(-1);
            }
          }
        })
        .catch(() => {
          setError({ status: 500, message: "Login failed: Check out your credentials & try again.", show: true })
        });

    } catch (err) {
      setError({ status: 500, message: "Something went wrong: Login failed", show: true });
    }
  }

  return (
    <>
      <div className="loginpageformhead">
        <div className="loginpageformheadtxt">
          Sign In
        </div>
        <div className="loginpageformheadmetatxt">
          You have already agreed to patch term & conditions.
        </div>
      </div>
      <div className="loginpageformbody">
        <form className="loginpageformloginform" onSubmit={loginUser}>
          <div className="loginpageinputs">
            <Askinput
              required={true}
              onChange={handleChange}
              prefixes={emailLogin ? [""] : ["u/"]}
              name={emailLogin ? "email" : "username"}
              placeholder={emailLogin ? "Email" : "Username"}
              onClickPostfix={() => setEmailLogin(!emailLogin)}
              value={emailLogin ? loginData.email : loginData.username}
              postfix={emailLogin ? "ICchevron_left" : "ICchevron_right"}
            />
          </div>
          <div className="loginpageinputs">
            <Askinput
              name={"password"}
              required={true}
              placeholder={"Password"}
              onChange={handleChange}
              value={loginData.password}
              type={showPassword ? "text" : "password"}
              postfix={showPassword ? "IChttps" : "ICno_encryption"}
              onClickPostfix={() => setShowPassword(!showPassword)}
            />
          </div>
          <div className="loginpageforgotpass">
            Forget your
            <div className="loginpageextrapd" onClick={() => handleLoginGreetings(3)}> password </div>
            ?
          </div>
          <div className="loginpagebtnwrapper">
            <Patbtn
              size={"big"}
              type={"submit"}
              state={"active"}
              text={"log in"}
              disabled={(
                (!emailLogin ? loginData?.username?.length === 0 : loginData?.email?.length === 0)
                || loginData?.password?.length === 0
              )}
            />
          </div>
        </form>
        <Otherlogins
          handleLoginGreetings={handleLoginGreetings}
        />
      </div>
    </>
  )
}

export default Log;