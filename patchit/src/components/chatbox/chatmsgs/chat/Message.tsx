import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//utils
import { dateFormatter } from "../../../../utils/helpers/helpers";

//components
import Patpicer from "../../../html/Patpicer";

//css & types
import "../../css/message.css";
import { messageprops, messagetexttype } from "../../types";

const Message = (messageprops: messageprops) => {
  const { userId, userInfo, messageInfo, isRoom } = messageprops;

  const navigate = useNavigate();
  const message: messagetexttype = JSON.parse(messageInfo.text);

  //states  
  const [activePics, setActivePics] = useState<string[]>([]);
  const [showChatPics, setShowChatPics] = useState<boolean>(false);

  //handlers
  useEffect(() => {
    if (activePics.length > 0) {
      setShowChatPics(true);
    } else {
      setShowChatPics(false);
    }
  }, [activePics])

  return (
    <div className={userId === userInfo.id ? "chatlmsg" : "chatrmsg"}>
      <Patpicer
        pics={activePics}
        showPic={showChatPics}
        setShowPic={setShowChatPics}
      />
      <div className={userId === userInfo.id ? "sentmessagebody" : "receivedmessagebody"}>
        <div className="sentchatoptions">
          <div className="chatoptions">
            <i className="material-icons chatoptionicn"> delete_forever </i>
          </div>
        </div>
        {messageInfo.media ? (
          <div className={userId === userInfo.id ? "sentmedia" : "receivedmedia"}>
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
          <div className={userId === userInfo.id ? "senttxt" : "receivedtxt"}>
            {message.txt}
          </div>
        )}
      </div>
      <div className="messageinfo">
        {isRoom && (userInfo.id !== userId) && (
          <div className="messageuser" onClick={() => navigate(`/u/${messageInfo?.user_id?.username}`)}>
            {messageInfo?.user_id?.username}
          </div>
        )}
        <div className="messagetime">
          {dateFormatter(messageInfo?.created_at)}
        </div>
        {isRoom && (userInfo.id === userId) && (
          <div className="messageuser" onClick={() => navigate(`/u/${messageInfo?.user_id?.username}`)}>
            {messageInfo?.user_id?.username}
          </div>
        )}
      </div>
    </div>
  )
}

export default Message;