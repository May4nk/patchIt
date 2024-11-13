import React from 'react';

//components
import Askinput from '../html/Askinput';

//types
import { loginforgetdatatype } from './types';
interface forgotpasswordpropstype {
  forgotData: loginforgetdatatype;
  handleForgetChange: (e: any) => void;
}

function Forgotpassword(forgotpasswordprops: forgotpasswordpropstype) {
  const { forgotData, handleForgetChange } = forgotpasswordprops;

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
      <button
        type="submit"
        id="modalloginbtn"
        className="btn waves-effect waves-light"
        disabled={(forgotData.forgotpassword) ? false : true}
      >
        forget
      </button>
    </form>
  )
}

export default Forgotpassword;