import React from 'react';

//component
import Askinput from '../../html/Askinput';

//css & types
import "../css/chatmsgs.css";
import { chatgroupusertype, chatgroupcardprops } from '../types';

function Chatgroupcard(chatgroupcardprops: chatgroupcardprops) {
  const { roomName, setRoomName, chatgroupUsers, setChatgroupUsers } = chatgroupcardprops;

  //handlers
  const handleRemoveSelectedUser: (id: number) => void = (id: number) => {
    const tempGroupUsers: chatgroupusertype[] = chatgroupUsers.filter((user: chatgroupusertype) => (
      user.id !== id
    ));
    setChatgroupUsers(tempGroupUsers);
  }

  return (
    <>
      <div className="groupname">
        <Askinput
          value={roomName}
          placeholder={"Room Name"}
          onChange={(e: any) => setRoomName(e.target.value)}
        />
      </div>
      <div className="selectedGroupUsers">
        {chatgroupUsers.map((groupUser: chatgroupusertype, idx: number) => (
          <div
            key={idx}
            className="groupUser waves-light waves-effect"
            onClick={() => handleRemoveSelectedUser(groupUser.id)}
          >
            {groupUser.username}
          </div>
        ))}
      </div>
    </>
  )
}

export default Chatgroupcard;