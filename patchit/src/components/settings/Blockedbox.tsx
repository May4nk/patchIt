import React, { useEffect, useState } from 'react';

//components
import Patchip from '../html/Patchip';

//types & css
import "./main.css";
import { blockedboxpropstype } from './types';

function Blockedbox(blockedboxprops: blockedboxpropstype) {
  const { blockedUsers, title, setShowBlockedBox } = blockedboxprops;

  //states
  const [bannedUsers, setBannedUsers] = useState<string[]>([]);

  //handlers
  const handleDefault: () => void = () => {
    setShowBlockedBox(false);
  }

  useEffect(() => {
    if (blockedUsers) {
      setBannedUsers(JSON.parse(blockedUsers));
    }
  }, [blockedUsers])

  return (
    <div className="privacybox">
      <div className="textboxtitle">
        {title ? title : "Blocked"}
      </div>
      <div className="privacyboxbody">
        {blockedUsers && (
          bannedUsers.map((uname: string, idx: number) => (
            <Patchip
              key={idx}
              title={uname}
            />
          ))
        )}
      </div>
      <div className="privacyboxfooter">
        <div
          onClick={() => handleDefault()}
          className="waves-effect waves-light black-text red lighten-2 socialactionbtn"
        >
          cancel
        </div>
        <div
          onClick={() => handleDefault()}
          className="waves-effect waves-light black-text blue lighten-3 socialactionbtn"
        >
          update
        </div>
      </div>
    </div>
  )
}

export default Blockedbox;