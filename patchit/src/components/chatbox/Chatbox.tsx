import React from "react";
import { useLazyQuery } from "@apollo/client";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";

import Chatlist from "./chatlist/Chatlist";
import Chatmsgs from "./chatmsgs/Chatmsgs";

import { GETUSERCHATROOMS, USERCHATROOM } from "./queries";
import { SUBSCRIBETOUSERCHATROOMS } from "./queries";

import "./css/chatbox.css";
import { authcontexttype } from "../../context/types.js";
import { 
  chatboxprops, 
  activeroomtype, 
  userchatroomprevtype, 
  userchatroomsubscriptiondatatype, 
  userchatroomtype 
} from "./types.js";


const Chatbox = (chatboxprops: chatboxprops) => {
  const { showChatbox, setShowChatbox } = chatboxprops;
  const show: string = showChatbox ? "display" : "none";
  
  const { user }: authcontexttype = useContext(AuthContext); 
  const userId: number | null = user && Number(user["id"] || user["user_id"]); 
  
  const [chatLevel, setChatLevel] = useState<number>(0);
  const [createRoom, setCreateRoom] = useState<boolean>(false);
  const [activeRoom, setActiveRoom] = useState<activeroomtype>({ username: "", roomId: "" });
  
  //queries
  const [getUserchatrooms, { data, subscribeToMore }] = useLazyQuery(GETUSERCHATROOMS);
  
  //handlers
  const handleNew: (room: boolean) => void = (room = false) => {
    if(room) {
      setCreateRoom(true);     
    } else {
      setCreateRoom(false);
    }
    setChatLevel(1); 
    setActiveRoom({ username: "", roomId: "" });
  }

  const handleActiveRoom: (room: activeroomtype) => void = (room) => {
    setCreateRoom(false);
    setChatLevel(0);
    setActiveRoom({ username: room.username, roomId: room.roomId });
  }
  
  useEffect(() => {    
    subscribeToMore({
      document: SUBSCRIBETOUSERCHATROOMS,
      variables: { userId: Number(userId) },
      updateQuery: (prev: userchatroomprevtype, { subscriptionData }: userchatroomsubscriptiondatatype) => {
        const subdata = subscriptionData.data;        
        if(!subdata) return prev;
        const newChatroom: userchatroomtype[] = subdata.newUserChatroom;    
        console.log(prev, "prev");        
        return {
          listSpecificUserChatrooms: [ ...newChatroom, ...prev?.listSpecificUserChatrooms ]
        };
      },            
    })  
  },[subscribeToMore])

  useEffect(() => {
    if(showChatbox) {
      getUserchatrooms({
        variables: {
          "userId": userId!
        }
      });      
    }
  },[showChatbox])

  return (
    <div className={ show }>
      <div className="chatbox">
        <div className="chatlist">
          <Chatlist 
            chatrooms={ data?.listSpecificUserChatrooms } 
            handleActiveRoom={ handleActiveRoom } 
            activeRoom={ activeRoom }
            handleNew={ handleNew } 
            createRoom={ createRoom }             
          />
        </div>
        <div className="chatmsgs">
          <Chatmsgs
            chatLevel={chatLevel}
            setChatLevel={setChatLevel}
            activeRoom={activeRoom}
            setActiveRoom={setActiveRoom}
            createRoom={createRoom}
            setCreateRoom={setCreateRoom}
            handleActiveRoom={handleActiveRoom}
            setShowChatbox={setShowChatbox}
            userId={userId}
          />
        </div>
      </div>
    </div>
  )
}

export default Chatbox;
