import React from 'react';
import Askinput from '../../html/Askinput';
//css & types
import "../css/chatmsgs.css";
import { chatgroupusertype } from '../types';

interface chatgroupcardprops {
  roomName: string;
  setRoomName: React.Dispatch<React.SetStateAction<string>>;
  chatgroupUsers: chatgroupusertype[];
  setChatgroupUsers: React.Dispatch<React.SetStateAction<chatgroupusertype[]>>;
}

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
          placeholder={"Room Name"}
          value={roomName}
          onChange={(e: any) => setRoomName(e.target.value)}
          required={true}
        />
      </div>
      <div className="selectedGroupUsers">
        {chatgroupUsers.map((groupUser: chatgroupusertype, idx: number) => (
          <div className="groupUser waves-light waves-effect"
            key={idx}
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