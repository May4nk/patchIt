import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { dateFormatter } from "../../../utils/helpers";

//components
import Patpicer from "../../html/Patpicer";

//css & types
import "../css/message.css";
import { messageprops, messagetexttype } from "../types";

const Message = (messageprops: messageprops) => {
  const { userId, userInfo, messageInfo, activeRoom } = messageprops;

  const navigate = useNavigate();
  const message: messagetexttype = JSON.parse(messageInfo.message);

  //states
  const [isGroup, setIsGroup] = useState<boolean>(false);
  const [activePics, setActivePics] = useState<string[]>([]);
  const [showChatPics, setShowChatPics] = useState<boolean>(false);

  //handlers
  useEffect(() => {
    if (activeRoom) {
      setIsGroup(activeRoom?.users >= 2)
    }
  }, [activeRoom]);

  useEffect(() => {
    if (activePics.length > 0) {
      setShowChatPics(true);
    } else {
      setShowChatPics(false);
    }
  }, [activePics])

  return (
    <div className={userId === Number(userInfo.id) ? "chatlmsg" : "chatrmsg"}>
      <Patpicer
        pics={activePics}
        showPic={showChatPics}
        setShowPic={setShowChatPics}
      />
      <div className={userId === Number(userInfo.id) ? "sentmessagebody" : "receivedmessagebody"}>
        <div className="sentchatoptions">
          <div className="chatoptions">
            <i className="material-icons chatoptionicn"> delete_forever </i>
          </div>
        </div>
        {messageInfo.media ? (
          <div className={userId === Number(userInfo.id) ? "sentmedia" : "receivedmedia"}>
            <div className="chatmedia" onClick={() => setActivePics([...message.media])}>
              {message.media.slice(0, 4).map((picurl: string, idx: number) => (
                <img
                  key={idx}
                  alt="mediapics"
                  className="mediapic"
                  src={picurl}
                />
              ))}
            </div>
            {message.media.length > 4 && (
              <div className="totalchatimgs">
                +{message.media.length - 4}
                <i className="material-icons totalimgicn">photo_library</i>
              </div>
            )}
            <div className="sentmediatxt">
              {message.txt}
            </div>
          </div>
        ) : (
          <div className={userId === Number(userInfo.id) ? "senttxt" : "receivedtxt"}>
            {message.txt}
          </div>
        )}
      </div>
      <div className="messageinfo">
        {isGroup && (userInfo.id !== userId) && (
          <div className="messageuser" onClick={() => navigate(`/u/${messageInfo?.user_id?.username}`)}>
            {messageInfo?.user_id?.username}
          </div>
        )}
        <div className="messagetime">
          {dateFormatter(messageInfo?.created_at)}
        </div>
        {isGroup && (userInfo.id === userId) && (
          <div className="messageuser" onClick={() => navigate(`/u/${messageInfo?.user_id?.username}`)}>
            {messageInfo?.user_id?.username}
          </div>
        )}
      </div>
    </div>
  )
}

export default Message;