import React from "react";
import { useAuth } from "../../../common/hooks/useAuth";

import Chatprofiles from "./Chatprofiles";

//css & types
import "../css/chatlist.css";
import { chatlistprops, chattertype, userchatroomtype, usertype } from "../types.js";
import { authcontexttype } from "../../../context/types.js";

const Chatlist = (chatlistprops: chatlistprops) => {
  const { chatrooms, handleActiveRoom, handleNew, createRoom, activeRoom } = chatlistprops;

  const { user }: authcontexttype = useAuth();
  const userId: number | null = user && Number(user["id"] || user["user_id"]);

  const chatters = chatrooms?.map((room: userchatroomtype) => {
    return {
      users: room?.users?.filter((usr: usertype) => usr.id !== userId),
      room: room?.room_id,
      message: room?.lastMessage?.message
    }
  });

  return (
    <div className="lchatcontainer">
      <div className="rooms">
        {chatters?.map((chatroom: chattertype, idx: number) => (
          <Chatprofiles
            key={idx}
            handleActiveRoom={handleActiveRoom}
            chatroom={chatroom}
          />
        ))}
      </div>
      <div className="newroombtns">
        {!createRoom && (
          <div className="newroombtn waves-effect waves-light" onClick={() => handleNew(true)}>
            New Room
          </div>
        )}
        {(activeRoom.roomId.length !== 0 || createRoom) && (
          <div className="newchatbtn waves-effect waves-light" onClick={() => handleNew(false)}>
            Start Chat
          </div>
        )}
      </div>
    </div>
  )
}

export default Chatlist;

