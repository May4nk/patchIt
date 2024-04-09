import React, { useState } from 'react';
//components
import Patchip from '../../components/html/Patchip';
//css & types
import "./profilesettings.css";
import { privacystatetype } from './profilesettingtypes';
interface privacyprops {
  handleChange: (e: any, statename: string) => void;
  privacyState: privacystatetype;
}

function Privacytab(privacyprops: privacyprops) {
  const { privacyState, handleChange } = privacyprops;

  const [showBox, setShowBox] = useState<boolean>(false);  

  return (
    <>
      <div className="usetting">
        <div className="usettingtitle"> Manage Privacy </div>
        <div className="usettingtitlemeta"> Safety </div>
        <div className="usettingitems">
          <div className="usettingitemlabels">
            <div className="usettingitemtitle"> People you've blocked</div>
            <div className="usettingitemmetatitle">
              Blocked people can’t send you chat requests or private messages.
            </div>
          </div>
          <div className="waves-effect waves-light black-text blue usettingitembtn"
            onClick={() => setShowBox(!showBox)}
          >
            Update
          </div>
        </div>
        <div className="usettingitems">
          <div className="usettingitemlabels">
            <div className="usettingitemtitle"> Communities you've muted </div>
            <div className="usettingitemmetatitle">
              Posts from muted communities won't show up in your feeds or recommendations.
            </div>
          </div>
          <div className="waves-effect waves-light black-text blue usettingitembtn">
            Change
          </div>
        </div>
        <div className="usettingtitlemeta"> privacy </div>
        <div className="usettingitems">
          <div className="usettingitemlabels">
            <div className="usettingitemtitle"> Show up in search result </div>
          </div>
          <div className="switch">
            <label>
              <input
                type="checkbox"
                className="blue-text"
                checked={privacyState.searchshowprofile}
                name="searchshowprofile"
                onChange={(e: any) => handleChange(e, "privacy")}
              />
              <span className="lever"></span>
            </label>
          </div>
        </div>
        <div className="usettingtitlemeta"> advanced security </div>
        <div className="usettingitems">
          <div className="usettingitemlabels">
            <div className="usettingitemtitle"> Use two-factor authentication </div>
          </div>
          <div className="switch">
            <label>
              <input
                type="checkbox"
                className="blue-text"
                name="auth_twofactor"
                checked={privacyState.auth_twofactor}
                onChange={(e: any) => handleChange(e, "privacy")}
              />
              <span className="lever"></span>
            </label>
          </div>
        </div>
      </div>
      {showBox && (
        <div className="privacybox">
          <div className="privacyboxtitle">
            blocked people
          </div>
          <div className="privacyboxbody">
            {privacyState?.blocked && (
              privacyState?.blocked?.map((uname: string, idx: number) => (
                <Patchip
                  key={idx}
                  title={uname}
                />
              ))
            )}
          </div>
          <div className="privacyboxfooter">
            <div className="blue black-text waves-effect waves-light privacyboxbtn">
              update
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Privacytab;