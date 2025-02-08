import React from 'react';

//component
import Askinput from '../../../html/Askinput';

//css & types
import "../../css/chatmsgs.css";
import { chatgroupusertype, chatgroupcardprops } from '../../types';

function Chatgroupcard(chatgroupcardprops: chatgroupcardprops) {
  const { roomName, handleChatBoxState, chatgroupUsers } = chatgroupcardprops;

  //handlers
  const handleRemoveSelectedUser: (id: string) => void = (id: string) => {
    handleChatBoxState({ type: "DEL_ROOM_USER", userId: id });
  }

  return (
    <>
      <div className="groupname">
        <Askinput
          name={"name"}
          value={roomName}
          placeholder={"Room Name"}
          onChange={(e: any) => handleChatBoxState({ type: "SET_ROOM_NAME", name: e.target.value })}
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