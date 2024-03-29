import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useAuth } from "../../common/hooks/useAuth";

//components
import Chatlist from "./chatlist/Chatlist";
import Chatmsgs from "./chatmsgs/Chatmsgs";

import { GETUSERCHATROOMS, SUBSCRIBETOUSERCHATROOMS } from "./queries"; //query

//css & types
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
  
  const { user }: authcontexttype = useAuth(); 
  const userId: number | null = user && Number(user["id"] || user["user_id"]); 
  
  const [chatLevel, setChatLevel] = useState<number>(0);
  const [createRoom, setCreateRoom] = useState<boolean>(false);
  const [activeRoom, setActiveRoom] = useState<activeroomtype>({ username: "", roomId: "" });
  
  //queries
  const { data, subscribeToMore } = useQuery(GETUSERCHATROOMS, {
    variables: {
      filter: {
        user_id: userId!
      }
    }
  });
  
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

  const handleActiveRoom: (e: any, room: activeroomtype) => void = (e: any, room: activeroomtype) => {
    let active = document.querySelector(".activechatter");
    if( active!== null) {
      active.classList.remove("activechatter");
    }
    e.currentTarget.classList.add("activechatter");
    setCreateRoom(false);
    setChatLevel(0);
    setActiveRoom({ username: room.username, roomId: room.roomId });
  }
  
  useEffect(() => {
    let unsubscribe = subscribeToMore({
      document: SUBSCRIBETOUSERCHATROOMS,
      variables: { userId: Number(userId) },
      updateQuery: (prev: userchatroomprevtype, { subscriptionData }: userchatroomsubscriptiondatatype) => {
        const subdata = subscriptionData.data;
        if(!subdata) return prev;
        const newChatroom: userchatroomtype[] = subdata.newUserChatroom;
        return {
          listUserChatrooms: [ ...newChatroom, ...prev?.listUserChatrooms ]
        };
      },
    });

    if(unsubscribe) return () => unsubscribe();
  },[subscribeToMore, userId]);

  return (
    <div className={ show }>
      <div className="chatbox">
        <div className="chatlist">
          <Chatlist 
            chatrooms={ data?.listUserChatrooms }
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
