import React, { useState } from 'react';
import useLoginvia from '../../utils/loginvia';

//components
import Askinput from '../html/Askinput';

//css, types & images
import "./loginbox.css";
import { loginpropstype, userlogintype } from './types';

function Login(loginprops: loginpropstype) {
  const { userData, handleChange, setForgetLevel, setError, closeLogin } = loginprops;
  const login = useLoginvia("login");

  const [showPassword, setShowPassword] = useState<boolean>(false);

  //handlers
  const handleLogin: (e: any) => Promise<void> = async (e: any) => {
    e.preventDefault();

    const loginData: userlogintype = {
      username: userData.username,
      password: userData.password
    }
    try {
      await login(loginData).then(() => {
        closeLogin();
      });
    } catch (err) {
      setError(err as string);
    }
  }

  return (
    <form className="form">
      <div className="loginforminp">
        <Askinput
          prefixes={["u/"]}
          name={"username"}
          onChange={handleChange}
          placeholder={"Username"}
          value={userData.username}
        />
      </div>
      <div className="loginforminp">
        <Askinput
          name={"password"}
          onChange={handleChange}
          placeholder={"Password"}
          value={userData.password}
          type={showPassword ? "text" : "password"}
          postfix={showPassword ? "IChttps" : "ICno_encryption"}
          onClickPostfix={() => setShowPassword(!showPassword)}
        />
      </div>
      <div className={"forgotpass"}>
        Forget your
        <span className="fpassword" onClick={() => setForgetLevel(1)}> username </span>
        or
        <span className="fpassword" onClick={() => setForgetLevel(2)}> password </span>
        ?
      </div>
      <button
        id="modalloginbtn"
        type="submit"
        className="btn waves-effect waves-light"
        onClick={handleLogin}
        disabled={(userData?.username && userData?.password) ? false : true}
      >
        Login
      </button>
    </form>
  )
}

export default Login;