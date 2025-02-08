import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

//utils
import useLoginvia from '../../utils/helpers/loginvia';

//components
import Patbtn from '../../components/html/Patbtn';
import Askinput from '../../components/html/Askinput';

//queries
import { FORGETPASSWORD, REQUESTFORGETPASSWORD } from '../../utils/loginqueries';

//css, pics & types
import "./login.css";
import { fpasswordpropstype, fpasswordtype } from './types';
const mailpic: string = require("../../img/maillogo.png");

function Fpassword(fpasswordprops: fpasswordpropstype) {
  const { setError, handleLoginGreetings, loginLevel, token } = fpasswordprops;
  const checkEmail = useLoginvia("isUsernameAvailable");

  //states
  const [clicked, setClicked] = useState<boolean>(false);
  const [forgetPasswordEmail, setForgetPasswordEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<fpasswordtype>({ password: "", cpassword: "" });

  //mutations
  const [requestForgetPassword] = useMutation(REQUESTFORGETPASSWORD);
  const [forgetPassword] = useMutation(FORGETPASSWORD);

  //handlers
  const handleChange: (e: any) => void = (e: any) => {
    setNewPassword({
      ...newPassword,
      [e.target.name]: e.target.value
    })
  }

  const handleRequestForgetPassword: (e) => Promise<void> = async (e) => {
    e.preventDefault();
    setClicked(true);

    if (forgetPasswordEmail.length < 1) {
      setError({ status: 500, show: true, message: "Email is required!!!" });
      setClicked(false);
      return;
    }

    const isEmailExists = await checkEmail(null, forgetPasswordEmail);

    if (!isEmailExists) {
      setClicked(false);
      setError({
        status: 500,
        show: true,
        message: "Account don't Exist with this email, Try signing up.",
      });

      return;
    }

    try {
      await requestForgetPassword({
        variables: {
          data: {
            email: forgetPasswordEmail,
            message: `Forget your password? Click here to create one \n`,
          }
        },
        onCompleted: () => {
          handleLoginGreetings(4);
          setClicked(false);
        }
      });
    } catch (err) {
      setClicked(false);
      setError({
        status: 500,
        show: true,
        message: "Request Forget password failed: Something went wrong"
      });
    }
  }

  const handleForgetPassword: (e) => Promise<void> = async (e) => {
    e.preventDefault();

    if (newPassword.password.length < 0 && newPassword.cpassword.length < 0) {
      setError({
        status: 500,
        show: true,
        message: "Password & confirm password is required!!!"
      })

      return;
    }

    if (!token || token?.length < 0) {
      setError({
        status: 500,
        show: true,
        message: "Forget password failed: Something went wrong"
      })

      return;
    }

    if (newPassword.password !== newPassword.cpassword) {
      setError({
        status: 500,
        show: true,
        message: "Password & confirm password doesn't match!!!"
      })

      return;
    }

    try {
      await forgetPassword({
        variables: {
          data: {
            token: token,
            password: newPassword.password,
            cpassword: newPassword.cpassword,
          }
        },
        onCompleted: () => {
          handleLoginGreetings(0);
          setError({
            status: 0,
            show: true,
            message: "Password updated: you are loggedout from all devices."
          })
        }
      });

    } catch (err) {
      setError({
        status: 500,
        show: true,
        message: "Forget password failed: Something went wrong"
      });
    }
  }

  return (
    <>
      <div className="loginpageformhead">
        <div className="loginpageformheadtxt">
          {loginLevel === 5 ? "Create Password" : loginLevel === 4 ? "Check Mail" : "Can't remember password?"}
        </div>
        <div className="loginpageformheadmetatxt">
          {loginLevel === 5 ?
            "Now you can continue start patching"
            : loginLevel === 4
              ? "And Create new password instantly"
              : "Use your mail to get link to your associated account..."
          }
        </div>
      </div>
      <div className="loginpageformbody">
        {loginLevel === 3 ? (
          <form className="loginpageformloginform" onSubmit={handleRequestForgetPassword}>
            <div className="loginpageinputs">
              <Askinput
                name={"email"}
                required={true}
                placeholder={"Email"}
                value={forgetPasswordEmail}
                onChange={(e) => setForgetPasswordEmail(e.target.value)}
              />
            </div>
            <div className="loginpagebtnwrapper">
              <Patbtn
                type={"submit"}
                state={"active"}
                lasticn={clicked ? "email" : ""}
                text={!clicked ? "Forget" : "Sending"}
                disabled={(forgetPasswordEmail?.length === 0 || clicked)}
              />
            </div>
          </form>
        ) : (loginLevel === 4) ? (
          <div className="clicksignupbox">
            <div className="clicksignuppic">
              <img src={mailpic} className="clicksignuppic" alt={"mail_pic"} />
            </div>
            <div className="clicksignuptitle">
              Mail sent successfully
              <div className="material-icons clicksignuptitleicn"> mail_outline </div>
            </div>
            <div className="clicksignupmetatitle">
              Click on the sent link to reset your password.
            </div>
          </div>
        ) : (
          <form className="loginpageformloginform" onSubmit={handleForgetPassword}>
            <div className="loginpageinputs">
              <Askinput
                name={"password"}
                required={true}
                onChange={handleChange}
                value={newPassword.password}
                placeholder={"Create Password"}
              />
            </div>
            <div className="loginpageinputs">
              <Askinput
                name={"cpassword"}
                required={true}
                onChange={handleChange}
                value={newPassword.cpassword}
                placeholder={"Confirm Password"}
              />
            </div>
            <div className="loginpagebtnwrapper">
              <Patbtn
                type="submit"
                text={"create"}
                state={"active"}
                disabled={(newPassword.password?.length === 0 || newPassword.password?.length === 0)}
              />
            </div>
          </form>
        )}
      </div >
    </>
  )
}

export default Fpassword;