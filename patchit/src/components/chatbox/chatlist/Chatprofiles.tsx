import React from "react";

//css & types
import "../css/chatlist.css";
import { chatprofileprops } from "../types";

const pic = require("../../../img/unnamed.jpg");

const Chatprofiles = (chatprofileprops: chatprofileprops) => {
  const { handleActiveRoom, chatroom } = chatprofileprops;

  const username: string = chatroom.users.length === 1 ? chatroom.users[0].username : chatroom.room.room_code;
   
  return(
    <div className="chatters" 
      onClick={(e: any) => handleActiveRoom(e, { username: username , roomId: chatroom.room.room_code })}
    >
      <div className="chatterspicwrapper">
        <img src={ pic } className="chatterspic" alt="chatter_pic" />
      </div>           
      <div className="chatterstext"> 
        <div className="chatterstextprofile"> 
          { username }
        </div>
        <div className="chatterstextmsg"> 
          boom 
        </div>
      </div>
    </div>
  )
}

export default Chatprofiles;

