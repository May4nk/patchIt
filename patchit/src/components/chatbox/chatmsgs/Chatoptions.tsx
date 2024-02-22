import React, { useRef } from "react";
import { useMutation } from "@apollo/client";

import { DELETECHATROOM } from "../queries";

import "../css/chatmsgs.css";

interface chatoptionsprops {
  showChatoptions: boolean;
  setShowChatOptions: any;
  roomId: string;
}

const Chatoptions = (chatoptionsprops: chatoptionsprops) => {
  const { showChatoptions, setShowChatOptions, roomId } = chatoptionsprops;
  
  const thisRef = useRef<HTMLDivElement>(null);
  const [deleteChatroom] = useMutation(DELETECHATROOM);

  //handler
  const handleDelete:() => void = () => {
    deleteChatroom({
      variables: {
        data: {
          room_code: roomId
        }
      }
    })
  }

  const closeDrop = (e: any) => {   
    if(thisRef.current && showChatoptions && !thisRef.current.contains(e.target)){
      setShowChatOptions(false)
    }
  }
  
  document.addEventListener('mousedown', closeDrop);

  return (
    <div className="chatroomoptionsdrop" ref={ thisRef }>   
      <i className="material-icons chattitleicn" onClick={ () => setShowChatOptions(!showChatoptions) }>
        more_horiz
      </i>
      { showChatoptions && (
      <div className="chatroomoptionwrapper">
        <div className="chatroomoptions waves-effect waves-light" onClick={ handleDelete }>
          Delete
          <i className="material-icons chatroomoptionicn"> 
            delete
          </i>
        </div>
        <div className="chatroomoptions waves-effect waves-light">
          Block
          <i className="material-icons chatroomoptionicn"> 
            block
          </i>
        </div>
      </div>
      )}
    </div>
  )
}

export default Chatoptions;
