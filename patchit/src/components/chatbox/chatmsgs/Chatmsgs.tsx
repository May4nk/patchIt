import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";

//components
import Chat from "./Chat";
import Chatoptions from "./Chatoptions";
import Aboutchatroom from "./Aboutchatroom";
import Createchatroom from "./Createchatroom";
import Chatroomsettings from "./chatgroupsettings/Chatroomsettings";

//queries
import { DELETECHATROOM, GETALLUSERS } from "../queries";

//css & types
import "../css/chatmsgs.css";
import { chatmsgsprops } from "../types";
const logo = require("../../../img/white-logo.png")

const Chatmsgs = (chatmsgsprops: chatmsgsprops) => {
  const {
    error,
    userId,
    setError,
    roomName,
    chatLevel,
    activeRoom,
    createRoom,
    setRoomName,
    setChatLevel,
    chatgroupUsers,
    usernameSearch,
    chatroomInfo,
    setChatGroupUsers,
    setUsernameSearch,
    handleDefaultState,
    handleCreateChatroom,
    updateChatroomInfo,
  } = chatmsgsprops;

  //states
  const [showChatoptions, setShowChatOptions] = useState<boolean>(false);

  //queries
  const [deleteChatroom] = useMutation(DELETECHATROOM);
  const [getUsers, { data }] = useLazyQuery(GETALLUSERS);

  //handlers  
  const handleDelete: () => Promise<void> = async () => {
    await deleteChatroom({
      variables: {
        data: {
          room_code: activeRoom.roomId
        }
      }
    })
  };

  useEffect(() => {
    getUsers({
      variables: {
        filter: {
          "status": "ACTIVE",
        }
      }
    });
  }, []);

  return (
    <div className="rchatcontainer">
      <div className="chattitle">
        {activeRoom.roomId.length !== 0 ? (
          <div className="chatuserpage" onClick={() => setChatLevel(1)}>
            {chatLevel === 2 && (
              <i className="material-icons chatuserpageicn blue-text">
                settings
              </i>
            )}
            {chatroomInfo.roomName}
          </div>
        ) : (
          <>
            {chatLevel === 101 ? (
              createRoom ? "Create Room" : "Start Chat"
            ) : ("")}
          </>
        )}
        <div className="chattitleicnwrapper">
          {chatLevel === 0 && (
            activeRoom.roomId.length !== 0 && (
              <Chatoptions
                handleDelete={handleDelete}
                showChatoptions={showChatoptions}
                setShowChatOptions={setShowChatOptions}
              />
            )
          )}
          <i className="material-icons tiny chattitleicn" onClick={() => handleDefaultState(false)}>
            clear
          </i>
        </div>
      </div>
      <div className={`${error.status === 200
        ? "successerror"
        : error.status === 0
          ? "infoerror"
          : "checkerror"
        }
        ${error.show ? "showerror" : ""}`
      }>
        <i className="material-icons checkerroricn">
          {error.status !== 200 ? "error_outline" : "insert_emoticon"}
        </i>
        {error.message}
      </div>
      <div className="chatbody">
        {activeRoom?.roomId.length !== 0 ? (
          <>
            {chatLevel === 0 ? (
              <Chat
                userId={userId}
                activeRoom={activeRoom}
                setError={setError}
              />
            ) : chatLevel === 1 ? (
              <Aboutchatroom
                userId={userId!}
                handleDelete={handleDelete}
                setChatLevel={setChatLevel}
                chatroomInfo={chatroomInfo}
              />
            ) : chatLevel === 2 && (
              <Chatroomsettings
                userId={userId!}
                setError={setError}
                usersList={data?.listUsers}
                chatroomPreferences={chatroomInfo}
                updateChatroomPreferences={updateChatroomInfo}
              />
            )}
          </>
        ) : (
          <>
            {chatLevel === 100 ? (
              <div className="startnewchat">
                <div className="chatlogowrapper">
                  <img src={logo} className="chatlogo" alt="Chat_logo" />
                </div>
                <div className="startnewchatbody">
                  <div className="startnewchattext">
                    Welcome to Chat!!!
                  </div>
                  <div className="startnewchatmetatext">
                    Start patching things here...
                  </div>
                </div>
              </div>
            ) : chatLevel === 101 && (
              <Createchatroom
                userId={userId}
                roomName={roomName}
                createRoom={createRoom}
                setRoomName={setRoomName}
                setChatLevel={setChatLevel}
                usersList={data?.listUsers}
                usernameSearch={usernameSearch}
                chatgroupUsers={chatgroupUsers}
                setUsernameSearch={setUsernameSearch}
                setChatgroupUsers={setChatGroupUsers}
                handleDefaultState={handleDefaultState}
                handleCreateChatroom={handleCreateChatroom}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Chatmsgs;
