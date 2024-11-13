import React from 'react';

//types
import { chatgroupblockedprops } from './types';
import { usernametype } from '../../../../utils/main/types';

function Chatgroupblocked(chatgroupblockedprops: chatgroupblockedprops) {
  const { roomSettings, updateRoomSettings, updateSettings, inmates, userId } = chatgroupblockedprops;

  const handleBlocked: (username: string, unblock: boolean) => void = (username: string, unblock: boolean) => {
    if (unblock) {
      updateRoomSettings({
        type: "UPDATE",
        payload: {
          ...roomSettings,
          blocked: roomSettings?.blocked?.filter((name: string) => name !== username)
        }
      });
    } else {
      updateRoomSettings({
        type: "UPDATE",
        payload: {
          ...roomSettings,
          blocked: [...roomSettings.blocked, username]
        }
      })
    }
  }

  return (
    <>
      <div className="groupsettingtext"> blocked users </div>
      <div className="groupusers">
        {roomSettings?.blocked.map((name: string, idx: number) => (
          <div
            key={idx}
            className="groupchooser waves-effect waves-light"
            onClick={() => handleBlocked(name, true)}
          >
            {name}
          </div>
        ))}
      </div>
      <div className="groupsettingtext"> inmates </div>
      <div className="groupusers">
        {inmates && inmates?.filter((user: usernametype) => (
          !roomSettings?.blocked.includes(user.username) && user.id !== userId
        )).map((user: usernametype, idx: number) => (
          <div
            key={idx}
            className="groupchooser waves-effect waves-light"
            onClick={() => handleBlocked(user.username, false)}
          >
            {user.username}
          </div>
        ))}
      </div>
      <div className="groupsettingoption">
        <div className="groupsettingbtn waves-effect waves-light blue-text" onClick={() => updateSettings()}>
          update
        </div>
      </div>
    </>
  )
}

export default Chatgroupblocked;