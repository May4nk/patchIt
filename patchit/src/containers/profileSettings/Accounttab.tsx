import React from 'react';
//css & types
import "./profilesettings.css";
import { userdatatype, modalstatetype } from './profilesettingtypes';
interface accountprops {
  userData: userdatatype;
  handleModalState: (mstate: modalstatetype) => void;
}

function Accounttab(accountprops: accountprops) {
  const { handleModalState, userData } = accountprops;

  return (
    <div className="usetting">
      <div className="usettingtitle"> Account settings </div>
      <div className="usettingtitlemeta"> ACCOUNT PREFERENCES </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> Email address </div>
          <div className="usettingitemmetatitle">
            {userData.email}
          </div>
        </div>
        <div className="waves-effect waves-light black-text blue usettingitembtn"
          onClick={() => {
            handleModalState({
              txt: "Update your Email Address",
              btntxt: "update",
              placeholder: "Email Address",
              toUpdate: "email"
            })
          }}
        >
          Update
        </div>
      </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> Change password </div>
          <div className="usettingitemmetatitle"> Password must be at least 8 characters long </div>
        </div>
        <div className="waves-effect waves-light black-text blue usettingitembtn">
          Update
        </div>
      </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> Deactivate account </div>
          <div className="usettingitemmetatitle">{userData.username}</div>
        </div>
        <div className="waves-effect waves-light black-text red usettingitembtn"
          onClick={() => handleModalState({
            txt: "Please enter 'delete/' followed by your username to confirm.",
            btntxt: "deactivate",
            placeholder: `delete/${userData.username}`,
            toUpdate: "status"
          })}
        >
          deactivate
        </div>
      </div>
    </div>
  )
}

export default Accounttab;