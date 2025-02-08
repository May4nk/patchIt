import React, { useState } from 'react';

//utils
import useLoginvia from '../../utils/helpers/loginvia';

//components
import Patbtn from '../html/Patbtn';
import Askinput from '../html/Askinput';

//css, types & images
import "./loginbox.css";
import { loginpropstype } from './types';
import { logindatatype } from '../../containers/Login/types';
import { loggedinuserdatatype } from '../../utils/types';
import { ASYNCVOIDFUNC, VOIDFUNC } from '../../utils/main/types';

function Login(loginprops: loginpropstype) {
  const { setActiveLoginLevel, setError, closeLogin } = loginprops;
  const login = useLoginvia("login");

  //states
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [logThroughEmail, setLogThroughEmail] = useState<boolean>(false);
  const [userLoginData, setUserLoginData] = useState<logindatatype>({
    email: "",
    username: "",
    password: "",
  });

  //handlers
  const handleDefault: VOIDFUNC = () => {
    setShowPassword(false);
    setLogThroughEmail(false)
    setUserLoginData({
      email: "",
      username: "",
      password: "",
    });
  }

  const handleChange: VOIDFUNC = (e: any) => {
    setUserLoginData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  const handleLogin: ASYNCVOIDFUNC = async (e: any) => {
    e.preventDefault();

    let loginData: logindatatype | undefined;

    if (!logThroughEmail && userLoginData?.username) {
      loginData = {
        username: userLoginData.username.trim(),
        password: userLoginData.password.trim(),
      }
    } else if (logThroughEmail && userLoginData?.email) {
      loginData = {
        email: userLoginData.email.trim(),
        password: userLoginData.password.trim(),
      }
    }

    if (!loginData) {
      setError({ status: 500, message: "Username/Email & password is required", show: true })
      return;
    }

    try {
      const data: loggedinuserdatatype = await login(loginData);
      if (data) {
        if (!data?.new_user) {
          handleDefault();
          closeLogin();
        }
      }
    } catch (err) {
      setError({ status: 500, message: "Try again: Check username/email & password", show: true });
    }
  }

  return (
    <form className="form" onSubmit={handleLogin}>
      <div className="loginforminp">
        <Askinput
          required={true}
          onChange={handleChange}
          prefixes={logThroughEmail ? [""] : ["u/"]}
          name={logThroughEmail ? "email" : "username"}
          placeholder={logThroughEmail ? "Email" : "Username"}
          value={logThroughEmail ? userLoginData.email : userLoginData.username}
          postfix={logThroughEmail ? "ICchevron_left" : "ICchevron_right"}
          onClickPostfix={() => setLogThroughEmail(!logThroughEmail)}
        />
      </div>
      <div className="loginforminp">
        <Askinput
          required={true}
          name={"password"}
          onChange={handleChange}
          placeholder={"Password"}
          value={userLoginData.password}
          type={showPassword ? "text" : "password"}
          postfix={showPassword ? "IChttps" : "ICno_encryption"}
          onClickPostfix={() => setShowPassword(!showPassword)}
        />
      </div>
      <div className={"forgotpass"}>
        Forget your
        <span className="fpassword" onClick={() => setActiveLoginLevel(3)}> password </span>
        ?
      </div>
      <div className="loginbtnwrapper">
        <Patbtn
          text={"login"}
          state={"active"}
          type="submit"
          disabled={(
            (logThroughEmail
              ? userLoginData?.email
              : userLoginData?.username
            ) && userLoginData?.password) ? false : true
          }
        />
      </div>
    </form>
  )
}

export default Login;