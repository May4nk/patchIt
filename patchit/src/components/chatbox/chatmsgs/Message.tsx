import React from "react";

//css
import "../css/chatmsgs.css";

interface messageprops {
  txt: string;
  id: number; 
  userId: number|null;
}

const Message = (messageprops: messageprops) => {  
  const { txt, id, userId } = messageprops;

  return (
    <div className={ userId === Number(id) ? "chatlmsg" : "chatrmsg" }>
      <div className="sentchatoptions">
        <div className="chatoptions">                   
          <i className="material-icons chatoptionicn"> delete_forever </i>
        </div>
      </div>
      <div className={ userId === Number(id) ? "senttxt" : "receivedtxt" }>
        { txt }
      </div>                  
    </div>
  )
}

export default Message;
