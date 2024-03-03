import React from "react";
import Chatprofiles from "./Chatprofiles";
import { useAuth } from "../../../common/hooks/useAuth";

import "../css/chatlist.css";
import { chatlistprops } from "../types.js";
import { authcontexttype } from "../../../context/types.js";


const Chatlist = (chatlistprops: chatlistprops) => {
  const { chatrooms, handleActiveRoom, handleNew, createRoom, activeRoom } = chatlistprops;

  const { user }: authcontexttype = useAuth(); 
  const userId: number | null = user && Number(user["id"] || user["user_id"]); 

  const chatters = chatrooms?.map((room: any) => { 
    return { users : room.users.filter((usr: any) => usr.id !== userId ), room: room.room_id 
  }});   
  
  return(
    <div className="lchatcontainer">
      <div className="rooms">
        { chatters?.map((chatroom: any, idx: number) => (                   
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

