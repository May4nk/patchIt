import React, { useRef } from "react";

//css & types
import "../css/chatmsgs.css";
import { chatoptionsprops } from "../types";

const Chatoptions = (chatoptionsprops: chatoptionsprops) => {
  const { showChatoptions, setShowChatOptions, handleDelete } = chatoptionsprops;
  const thisRef = useRef<HTMLDivElement>(null);

  //handlers
  const closeDrop: (e: any) => void = (e: any) => {
    if (thisRef.current && showChatoptions && !thisRef.current.contains(e.target)) {
      setShowChatOptions(false)
    }
  }

  document.addEventListener('mousedown', closeDrop);

  return (
    <div className="chatroomoptionsdrop" ref={thisRef}>
      <i className="material-icons chattitleicn" onClick={() => setShowChatOptions(!showChatoptions)}>
        more_horiz
      </i>
      {showChatoptions && (
        <div className="chatroomoptionwrapper">
          <div className="chatroomoption waves-effect waves-light" onClick={handleDelete}>
            Delete
            <i className="material-icons chatroomoptionicn">
              delete
            </i>
          </div>
          <div className="chatroomoption waves-effect waves-light">
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
