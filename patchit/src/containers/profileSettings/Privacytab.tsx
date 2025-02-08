import React, { useState } from 'react';

//components
import Patbtn from '../../components/html/Patbtn';
import Settingtab from '../../components/settings/Settingtab';
import Blockedbox from '../../components/settings/Blockedbox';

//css & types
import "./profilesettings.css";
import { privacytabpropstype } from './types';

function Privacytab(privacyprops: privacytabpropstype) {
  const { privacyState, handleChange } = privacyprops;

  //states
  const [showMutedBox, setShowMutedBox] = useState<boolean>(false);
  const [showBlockedBox, setShowBlockedBox] = useState<boolean>(false);

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
          <Patbtn
            text={showBlockedBox ? "hide" : "Update"}
            state={showBlockedBox ? "selected" : "inactive"}
            handleClick={() => setShowBlockedBox(!showBlockedBox)}
          />
        </div>
        <div className="usettingitems">
          <div className="usettingitemlabels">
            <div className="usettingitemtitle"> Communities you've muted </div>
            <div className="usettingitemmetatitle">
              Posts from muted communities won't show up in your feeds or recommendations.
            </div>
          </div>
          <Patbtn
            text={showMutedBox ? "hide" : "Update"}
            state={showMutedBox ? "selected" : "inactive"}
            handleClick={() => setShowMutedBox(!showMutedBox)}
          />
        </div>
        <div className="usettingtitlemeta"> privacy </div>
        <Settingtab
          title={"Show up in search result"}
          type={"switch"}
          name={"searchshowprofile"}
          value={privacyState.searchshowprofile}
          handleChange={(e: any) => handleChange(e, "privacy")}
        />
        <div className="usettingtitlemeta"> advanced security </div>
        <Settingtab
          title={"Use two-factor authentication"}
          type={"switch"}
          name={"auth_twofactor"}
          value={privacyState.auth_twofactor}
          handleChange={(e: any) => handleChange(e, "privacy")}
        />
      </div>
      <div className="actionboxes">
        {showBlockedBox && (
          <Blockedbox
            blockedUsers={privacyState?.blocked}
            setShowBlockedBox={setShowBlockedBox}
          />
        )}
        {showMutedBox && (
          <Blockedbox
            title={"Muted"}
            blockedUsers={privacyState?.blocked}
            setShowBlockedBox={setShowMutedBox}
          />
        )}
      </div>
    </>
  )
}

export default Privacytab;