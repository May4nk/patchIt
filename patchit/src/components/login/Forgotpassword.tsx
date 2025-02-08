import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

//utils
import useLoginvia from '../../utils/helpers/loginvia';

//queries
import { REQUESTFORGETPASSWORD } from '../../utils/loginqueries';

//components
import Patbtn from '../html/Patbtn';
import Askinput from '../html/Askinput';

//types & css
import "./loginbox.css";
import { forgotpasswordpropstype } from './types';
import { ASYNCVOIDFUNC } from '../../utils/main/types';
const postman_panda = require("../../img/postman_panda.png");

function Forgotpassword(forgotpasswordprops: forgotpasswordpropstype) {
  const { setError, activeLoginLevel, setActiveLoginLevel } = forgotpasswordprops;
  const verifyEmail = useLoginvia("isUsernameAvailable");

  //queries
  const [requestForgetPassword] = useMutation(REQUESTFORGETPASSWORD);

  //states
  const [clicked, setClicked] = useState<boolean>(false);
  const [forgotAccountEmail, setForgotAccountEmail] = useState<string>("");

  //handlers
  const handleRequestForgetPassword: ASYNCVOIDFUNC = async (e: any) => {
    e.preventDefault();
    setClicked(true);

    if (forgotAccountEmail.length < 1) {
      setError({ status: 500, show: true, message: "Email is required!!" });
      setClicked(false);
      return;
    } else {
      setError({ status: 0, show: false, message: "" });
    }

    const isEmailValid = await verifyEmail(null, forgotAccountEmail);

    if (!isEmailValid) {
      setError({ status: 500, show: true, message: "User doesn't exist with this email" });
      setClicked(false);
      return;
    } else {
      setError({ status: 0, show: false, message: "" });
    }

    try {
      await requestForgetPassword({
        variables: {
          data: {
            email: forgotAccountEmail,
            message: `Forget your password? Click here to create one \n`,
          }
        },
        onCompleted: () => {
          setActiveLoginLevel(4);
          setClicked(false);
        }
      });
    } catch (err) {
      setError({ status: 500, show: true, message: "Forget Password Failed: Something went wrong" });
      setClicked(false);
    }
  }

  return (
    <>
      {activeLoginLevel === 3 ? (
        <form className="forgetform" onSubmit={handleRequestForgetPassword}>
          <div className="loginforminp">
            <Askinput
              required={true}
              name={"forgotemail"}
              placeholder={"Email"}
              value={forgotAccountEmail}
              onChange={(e) => setForgotAccountEmail(e.target.value)}
            />
          </div>
          <div className="loginbtnwrapper">
            <Patbtn
              type={"submit"}
              text={!clicked ? "Forget" : "sending"}
              state={"active"}
              lasticn={clicked ? "email" : ""}
              disabled={(forgotAccountEmail.length < 1 || clicked)}
            />
          </div>
        </form>
      ) : activeLoginLevel === 4 && (
        <div className="magiclinksent">
          <img src={postman_panda} className="magiclinksentimg" alt="magiclinkimg" />
          <div className="magiclinksenthead">
            Check your mail
          </div>
          <div className="magiclinksentbody">
            <div className="magiclinksentinfo">
              We mailed a link to
            </div>
            <div className="magiclinksentmail">
              {forgotAccountEmail}
            </div>
            <div className="magiclinksentinfo">
              Click on sent link to update your password.
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Forgotpassword;