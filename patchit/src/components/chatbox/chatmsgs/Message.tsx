import React from "react";
import { useNavigate } from "react-router-dom";
import { dateFormatter } from "../../../common/helpers";
//css & types
import "../css/message.css";
import { messagetype, userchatroomtype, usertype } from "../types";
interface messageprops {
  userId: number | null;
  userInfo: usertype;
  messageInfo: messagetype;
  chatroomInfo: userchatroomtype;
}

const Message = (messageprops: messageprops) => {
  const { userId, userInfo, messageInfo, chatroomInfo } = messageprops;
  const navigate = useNavigate();

  return (
    <div className={userId === Number(userInfo.id) ? "chatlmsg" : "chatrmsg"}>
      <div className={userId === Number(userInfo.id) ? "sentmessagebody" : "receivedmessagebody"}>
        <div className="sentchatoptions">
          <div className="chatoptions">
            <i className="material-icons chatoptionicn"> delete_forever </i>
          </div>
        </div>
        <div className={userId === Number(userInfo.id) ? "senttxt" : "receivedtxt"}>
          {messageInfo.message}
        </div>
      </div>
      <div className="messageinfo">
        {chatroomInfo?.users?.length > 2 && (userInfo.id !== userId) && (
          <div className="messageuser" onClick={() => navigate(`/u/${messageInfo?.user_id?.username}`)}>
            {messageInfo?.user_id?.username}
          </div>
        )}
        <div className="messagetime">
          {dateFormatter(messageInfo?.created_at)}
        </div>
        {chatroomInfo?.users?.length > 2 && (userInfo.id === userId) && (
          <div className="messageuser" onClick={() => navigate(`/u/${messageInfo?.user_id?.username}`)}>
            {messageInfo?.user_id?.username}
          </div>
        )}
      </div>
    </div>
  )
}

export default Message;
