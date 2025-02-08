import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

//utils
import { useAuth } from '../../utils/hooks/useAuth';

//components
import Patbtn from '../../components/html/Patbtn';
import Askinput from '../../components/html/Askinput';

//queries
import { CHANGEPASSWORD } from '../../utils/loginqueries';

//css & types
import "./profilesettings.css";
import { authcontexttype } from '../../context/types';
import { USER_S_N_TYPE } from '../../utils/main/types';
import { accountprops, setpasswordtype, showemailpassinputtype } from './types';

function Accounttab(accountprops: accountprops) {
  const { userData, handleState } = accountprops;

  const { user }: authcontexttype = useAuth();
  const userId: USER_S_N_TYPE = user && user["id"];

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
          handleState({
            type: "SET_ERROR",
            error: {
              status: 200,
              show: true,
              message: "Password updated successfully"
            }
          });
        }
      })
    } catch (err) {
      handleState({
        type: "SET_ERROR",
        error: {
          status: 500,
          show: true,
          message: "Try again: check your passwords again"
        }
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
                  name="email"
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
        <Patbtn
          state={showInput.email && tempEmail.length < 1 ? "clear" : "selected"}
          text={showInput.email ? tempEmail.length < 1 ? "cancel" : "verify" : "update"}
          handleClick={!showInput.email
            ? () => setShowInput({ ...showInput, email: true })
            : () => tempEmail.length < 1 ? handleCancel() : handleUpdateEmail()
          }
        />
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
        <Patbtn
          state={showInput.password
            && (password.old.length < 1 || password.new.length < 1)
            ? "clear"
            : "selected"
          }
          text={showInput.password
            ? (password.old.length < 1 || password.new.length < 1)
              ? "cancel"
              : "update"
            : "change"
          }
          handleClick={!showInput.password
            ? () => setShowInput({ ...showInput, password: true })
            : () => (password.old.length < 1 || password.new.length < 1) ? handleCancel() : handleUpdatePassword()
          }
        />
      </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> Deactivate account </div>
          <div className="usettingitemmetatitle">{userData?.username}</div>
        </div>
        <Patbtn
          state={"clear"}
          text={"deactivate"}
          handleClick={() => handleState({ type: "DELETE_ACCOUNT", deleteAcc: true })}
        />
      </div>
    </div >
  )
}

export default Accounttab;