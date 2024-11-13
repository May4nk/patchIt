import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import { useAuth } from '../../utils/hooks/useAuth';

//components
import Askinput from '../../components/html/Askinput';

//queries
import { CHANGEPASSWORD } from '../../utils/loginqueries';

//css & types
import "./profilesettings.css";
import { authcontexttype } from '../../context/types';
import { accountprops, setpasswordtype, showemailpassinputtype } from './types';

function Accounttab(accountprops: accountprops) {
  const { userData, setMessage, setDeactivateAcc } = accountprops;

  const { user }: authcontexttype = useAuth();
  const userId: number | null = user && Number(user["id"]);

  //queries
  const [updatePassword] = useMutation(CHANGEPASSWORD);

  //states
  const [showInput, setShowInput] = useState<showemailpassinputtype>({ email: false, password: false });
  const [tempEmail, setTempEmail] = useState<string>("");
  const [password, setPassword] = useState<setpasswordtype>({ old: "", new: "" });

  //handlers
  const handleUpdateEmail: () => Promise<void> = async () => {

  }

  const handleUpdatePassword: () => Promise<void> = async () => {
    if (!userId) return;

    try {
      await updatePassword({
        variables: {
          data: {
            id: userId,
            password: password.old,
            newPassword: password.new
          }
        },
        onCompleted: () => {
          setShowInput({ email: false, password: false });
          setPassword({ old: "", new: "" });
          setMessage({
            status: 200,
            show: true,
            message: "Password updated successfully"
          });
        }
      })
    } catch (err) {
      setMessage({
        status: 500,
        show: true,
        message: "Something went wrong: Password Updation failed"
      });
    }
  }



  const handleCancel: () => void = () => {
    setShowInput({ email: false, password: false });
    setTempEmail("");
    setPassword({ old: "", new: "" });
  }

  return (
    <div className="usetting">
      <div className="usettingtitle"> Account settings </div>
      <div className="usettingtitlemeta"> ACCOUNT PREFERENCES </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> Email address </div>
          <div className="usettingitemmetatitle">
            {showInput.email ? (
              <div className="updateinput">
                <Askinput
                  name="about"
                  value={tempEmail}
                  placeholder={userData.email}
                  onChange={(e: any) => setTempEmail(e.target.value)}
                />
              </div>
            ) : (
              userData.email
            )}
          </div>
        </div>
        <div
          className={`waves-effect waves-light black-text usettingitembtn ${
              showInput.email && (tempEmail.length < 1 ? "red lighten-3" : "blue lighten-3")
            }`
          }
          onClick={!showInput.email
            ? () => setShowInput({ ...showInput, email: true })
            : () => tempEmail.length < 1 ? handleCancel() : handleUpdateEmail()
          }
        >
          {showInput.email ?
            tempEmail.length < 1 ? "cancel" : "send"
            : "change"
          }
        </div>
      </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> Change password </div>
          <div className="usettingitemmetatitle">
            {showInput.password ? (
              <>
                <div className="updatepassword">
                  <Askinput
                    name="about"
                    value={password.old}
                    placeholder={"Old password"}
                    onChange={(e: any) => setPassword({ ...password, old: e.target.value })}
                  />
                </div>
                <div className="updatepassword">
                  <Askinput
                    name="about"
                    value={password.new}
                    type={"password"}
                    placeholder={"New password"}
                    onChange={(e: any) => setPassword({ ...password, new: e.target.value })}
                  />
                </div>
              </>
            ) : (
              <>
                Password must be at least 8 characters long
              </>
            )}
          </div>
        </div>
        <div
          className={`waves-effect waves-light usettingitembtn ${
              showInput.password && (password.old.length < 1 ? "red lighten-3" : "blue lighten-3")
            }`
          }
          onClick={!showInput.password
            ? () => setShowInput({ ...showInput, password: true })
            : () => password.old.length < 1 ? handleCancel() : handleUpdatePassword()
          }
        >
          {showInput.password ?
            password.old.length < 1
              ? "cancel"
              : "update"
            : "change"
          }
        </div>
      </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> Deactivate account </div>
          <div className="usettingitemmetatitle">{userData?.username}</div>
        </div>
        <div
          onClick={() => setDeactivateAcc(true)}
          className="waves-effect waves-light black-text red usettingitembtn"
        >
          deactivate
        </div>
      </div>
    </div>
  )
}

export default Accounttab;