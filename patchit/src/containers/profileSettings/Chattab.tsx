import React from 'react';
//component
import Patdrop from '../../components/html/patdrop/Patdrop';
//css & types
import "./profilesettings.css";
import { profiletype, droppertype } from '../../components/html/patdrop/types';
import { chatstatetype } from './profilesettingtypes';
interface chatprops {
  chatState: chatstatetype;
  setChatState: React.Dispatch<React.SetStateAction<chatstatetype>>;
}

function Chattab(chatprops: chatprops) {
  const { chatState, setChatState } = chatprops;

  const privacyDropperprofile: profiletype = {
    icn: "lock",
    title: "Privacy",
  };

  const privacyDroppers: droppertype[] = [
    {
      value: "anyone", icn: "person_outline",
      state: "clicked", event: () => setChatState({ ...chatState, sendmsg: "ANYONE" })
    },
    {
      value: "none", icn: "lock_outline",
      state: "clicked", event: () => setChatState({ ...chatState, sendmsg: "NONE" })
    },
    {
      value: "followers", icn: "no_encryption",
      state: "clicked", event: () => setChatState({ ...chatState, sendmsg: "FOLLOWERS" })
    }
  ];

  return (
    <div className="usetting">
      <div className="usettingtitle"> Chat Preferences </div>
      <div className="usettingitems">
        <div className="usettingitemlabels">
          <div className="usettingitemtitle"> Who can send you chat request </div>
        </div>
        <div className="usettingitemdrop">
          <Patdrop profile={privacyDropperprofile} droppers={privacyDroppers} />
        </div>
      </div>
    </div>
  )
}

export default Chattab;