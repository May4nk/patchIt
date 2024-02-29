import React from "react";
import "../css/chatlist.css";
import { chatprofileprops } from "../types";

const pic = require("../../../img/unnamed.jpg");

const Chatprofiles = (chatprofileprops: chatprofileprops) => {
  const { handleActiveRoom, chatroom } = chatprofileprops;
   
  return(
    <div className="chatters" onClick={(e: any) => handleActiveRoom(e, { username: chatroom?.user_id.username, roomId: chatroom?.room_id.room_code })}>
      <div className="chatterspicwrapper">
        <img src={ pic } className="chatterspic" alt="chatter_pic" />
      </div>           
      <div className="chatterstext"> 
        <div className="chatterstextprofile"> 
          { chatroom?.user_id.username }
        </div>
        <div className="chatterstextmsg"> 
          boom 
        </div>
      </div>
    </div>
  )
}

export default Chatprofiles;

