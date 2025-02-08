import React, { useState } from 'react';

//components
import Patbtn from '../../components/html/Patbtn';
import Settingtab from '../../components/settings/Settingtab';
import Blockedbox from '../../components/settings/Blockedbox';

//types
import { privacytabpropstype } from './types';

function PrivacyTab(privacytabprops: privacytabpropstype) {
  const { privacyState, handleChange } = privacytabprops;

  //states
  const [showBlockedBox, setShowBlockedBox] = useState<boolean>(false);

  return (
    <>
      <div className="usetting">
        <div className="usettingtitle"> Manage Privacy </div>
        <div className="usettingtitlemeta"> Safety </div>
        <div className="usettingitems">
          <div className="usettingitemlabels">
            <div className="usettingitemtitle"> Blocked users</div>
            <div className="usettingitemmetatitle thememetanhtext">
              Blocked people can’t join or see community posts.
            </div>
          </div>
          <Patbtn
            text={showBlockedBox ? "hide" : "Update"}
            state={showBlockedBox ? "selected" : "inactive"}
            handleClick={() => setShowBlockedBox(prev => !prev)}
          />
          {/* <div
            className="waves-effect waves-light black-text usettingitembtn themeinactivebtnbg"
            onClick={() => setShowBlockedBox(!showBlockedBox)}
          >
            {showBlockedBox ? "hide" : "Update"}
          </div> */}
        </div>
        <div className="usettingtitlemeta"> privacy </div>
        <Settingtab
          name={"nsfw"}
          type={"switch"}
          value={privacyState.nsfw}
          title={"NSFW (Not Safe For Work)"}
          handleChange={(e: any) => handleChange(e, "privacy")}
          metatitle={"This content is NSFW (may contain nudity, pornography, profanity or inappropriate content for those under 18)"}
        />
      </div>
      <div className="actionboxes">
        {showBlockedBox && (
          <Blockedbox
            blockedUsers={null}
            setShowBlockedBox={setShowBlockedBox}
          />
        )}
      </div>
    </>
  )
}

export default PrivacyTab;