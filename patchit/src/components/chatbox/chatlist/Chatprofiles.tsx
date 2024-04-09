import React from "react";
//css & types
import "../css/chatlist.css";
import { chatprofileprops } from "../types";

const pic = require("../../../img/unnamed.jpg");

const Chatprofiles = (chatprofileprops: chatprofileprops) => {
  const { handleActiveRoom, chatroom } = chatprofileprops;
  const username: string = chatroom.users.length === 1 ? chatroom.users[0].username : chatroom.room.room_code;

  return (
    <div className={`chatters ${username}`}
      onClick={(e: any) => handleActiveRoom(username, { username: username, roomId: chatroom.room.room_code })}
    >
      <div className="chatterspicwrapper">
        <img src={pic} className="chatterspic" alt="chatter_pic" />
      </div>
      <div className="chatterstext">
        <div className="chatterstextprofile">
          {username}
        </div>
        <div className="chatterstextmsg">
          {chatroom?.message ?
            chatroom?.message.length > 27 ?
              `${chatroom?.message?.substr(0, 30)}...` :
              chatroom?.message
            : `Open to patch...`
          }
        </div>
      </div>
    </div>
  )
}

export default Chatprofiles;