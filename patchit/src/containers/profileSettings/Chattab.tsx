import React from 'react';

//component
import Settingtab from '../../components/settings/Settingtab';

//css & types
import "./profilesettings.css";
import { chatprops } from './types';
import { profiletype, droppertype } from '../../components/html/patdrop/types';

function Chattab(chatprops: chatprops) {
  const { chatState, setChatState } = chatprops;

  //handlers
  const chatDropperprofile: profiletype = { set: chatState.sendmsg };
  const chatDroppers: droppertype[] = [
    {
      title: "ANYONE", icn: "supervisor_account",
      state: "CLICKED", event: () => setChatState({ ...chatState, sendmsg: "ANYONE" })
    },
    {
      title: "NONE", icn: "lock_outline",
      state: "CLICKED", event: () => setChatState({ ...chatState, sendmsg: "NONE" })
    },
    {
      title: "FOLLOWERS", icn: "no_encryption",
      state: "CLICKED", event: () => setChatState({ ...chatState, sendmsg: "FOLLOWERS" })
    }
  ];

  return (
    <div className="usetting">
      <div className="usettingtitle"> Chat Preferences </div>
      <Settingtab
        title={"Who can send you chat request"}
        type={"drop"}
        dropperProfile={chatDropperprofile}
        droppers={chatDroppers}
      />
    </div>
  )
}

export default Chattab;