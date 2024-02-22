import React from "react";
import Chatprofiles from "./Chatprofiles";

import { chatlistprops } from "../types.js";
import "../css/chatlist.css";


const Chatlist = (chatlistprops: chatlistprops) => {
  const { chatrooms, handleActiveRoom, handleNew, createRoom, activeRoom } = chatlistprops;
  
  return(
    <div className="lchatcontainer">
      <div className="rooms">
        { chatrooms?.map((chatroom: any, idx: number) => (                   
          <Chatprofiles handleActiveRoom={ handleActiveRoom } chatroom={ chatroom } key={ idx } />
        ))}
      </div>
      <div className="newroombtns">
        { !createRoom && (
        <div className="newroombtn waves-effect waves-light" onClick={() => handleNew(true)}>
          Create Room
        </div>
        )}
        { (activeRoom.roomId.length !== 0 || createRoom )&& (
          <div className="newchatbtn waves-effect waves-light" onClick={() => handleNew(false)}>
            Create Chat
          </div>
        )}
      </div>
    </div>
  )
}

export default Chatlist;

