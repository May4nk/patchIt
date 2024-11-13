import React from 'react';

//components
import Askinput from '../html/Askinput';

//types
import { loginforgetdatatype } from './types';
interface forgotusernamepropstype {
  forgotData: loginforgetdatatype;
  handleForgetChange: (e: any) => void;
}

function Forgotusername(forgotusernameprops: forgotusernamepropstype) {
  const { forgotData, handleForgetChange } = forgotusernameprops;

  return (
    <form className="forgetform">
      <div className="loginforminp">
        <Askinput
          name={"forgotemail"}
          onChange={handleForgetChange}
          placeholder={"Email"}
          value={forgotData.forgotemail}
        />
      </div>
      <div className="loginforminp">
        <Askinput
          type={"password"}
          name={"forgotpassword"}
          onChange={handleForgetChange}
          placeholder={"Password"}
          value={forgotData.forgotpassword}
        />
      </div>
      <button
        type="submit"
        id="modalloginbtn"
        className="btn waves-effect waves-light"
        disabled={(forgotData?.forgotemail && forgotData.forgotpassword) ? false : true}
      >
        Login
      </button>
    </form>
  )
}

export default Forgotusername;