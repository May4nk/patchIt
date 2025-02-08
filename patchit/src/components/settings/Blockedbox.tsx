import React, { useEffect, useState } from 'react';

//components
import Patbtn from '../html/Patbtn';
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
      <div className="textboxfooter">
        <Patbtn
          text={"cancel"}
          state="clear"
          handleClick={handleDefault}
        />
        <Patbtn
          text={"not working"}
          state="selected"
          handleClick={handleDefault}
        />
      </div>
    </div>
  )
}

export default Blockedbox;