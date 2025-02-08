import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";

//components
import Chat from "./chat/Chat";
import Chatoptions from "./Chatoptions";
import Aboutchatroom from "./Aboutchatroom";
import Createchatroom from "./newchat/Createchatroom";
import Chatroomsettings from "./settings/Chatroomsettings";

//queries
import { DELETECHATROOM, GETALLUSERS } from "../queries";

//css & types
import "../css/chatmsgs.css";
import { ASYNCVOIDFUNC, ERRORTYPE } from "../../../utils/main/types";
import { chatlevels, chatmsgsprops, setchatleveltype, seterrortype } from "../types";
const logo = require("../../../img/white-logo.png")

const Chatmsgs = (chatmsgsprops: chatmsgsprops) => {
  const {
    userId,
    chatBoxState,
    handleChatBoxState,
    handleDefaultState,
    handleCreateChatroom,
  } = chatmsgsprops;

  //states
  const [showChatoptions, setShowChatOptions] = useState<boolean>(false);

  //queries
  const [deleteChatroom] = useMutation(DELETECHATROOM);
  const [getUsers, { data }] = useLazyQuery(GETALLUSERS);

  //handlers  
  const setChatLevel: setchatleveltype = (level: chatlevels) => {
    handleChatBoxState({ type: "SET_LEVEL", level });
  }

  const setError: seterrortype = (error: ERRORTYPE) => {
    handleChatBoxState({ type: "SET_ERROR", error });
  }

  const handleDelete: ASYNCVOIDFUNC = async () => {
    await deleteChatroom({
      variables: {
        data: {
          id: chatBoxState?.activeRoomId
        }
      }
    })
  };

  useEffect(() => {
    getUsers({
      variables: {
        filter: {
          "status": "ACTIVE",
          "privacy": "PUBLIC"
        }
      }
    });
  }, []);

  return (
    <div className="rchatcontainer">
      <div className="chattitle">
        {chatBoxState?.activeRoomId.length !== 0 ? (
          <div
            className="chatuserpage"
            onClick={() => handleChatBoxState({ type: "SET_LEVEL", level: 1 })}
          >
            {chatBoxState?.level === 2 && (
              <i className="material-icons chatuserpageicn blue-text">
                settings
              </i>
            )}
            {chatBoxState?.roomInfo.name}
          </div>
        ) : (
          <>
            {chatBoxState?.level === 101 ? (
              chatBoxState?.createRoom ? "Create Room" : "Start Chat"
            ) : ("")}
          </>
        )}
        <div className="chattitleicnwrapper">
          {chatBoxState?.level === 0 && (
            chatBoxState?.activeRoomId.length !== 0 && (
              <Chatoptions
                handleDelete={handleDelete}
                showChatoptions={showChatoptions}
                setShowChatOptions={setShowChatOptions}
              />
            )
          )}
          <i className="material-icons chattitleicn" onClick={() => handleDefaultState(true)}>
            clear
          </i>
        </div>
      </div>
      <div className={`${chatBoxState?.error.status === 200
        ? "successerror"
        : chatBoxState.error.status === 0
          ? "infoerror"
          : "checkerror"
        }
        ${chatBoxState?.error.show ? "showerror" : ""}`
      }>
        <i className="material-icons checkerroricn">
          {chatBoxState?.error.status !== 200 ? "error_outline" : "insert_emoticon"}
        </i>
        {chatBoxState?.error.message}
      </div>
      <div className="chatbody">
        {chatBoxState?.activeRoomId.length !== 0 ? (
          <>
            {chatBoxState?.level === 0 ? (
              <Chat
                userId={userId}
                setError={setError}
                activeRoomInfo={{ id: chatBoxState.activeRoomId, isRoom: chatBoxState.roomInfo.isRoom }}
              />
            ) : chatBoxState?.level === 1 ? (
              <Aboutchatroom
                userId={userId!}
                setChatLevel={setChatLevel}
                handleDelete={handleDelete}
                chatroomInfo={chatBoxState.roomInfo}
              />
            ) : chatBoxState.level === 2 && (
              <Chatroomsettings
                userId={userId!}
                usersList={data?.listUsers}
                handleChatBoxState={handleChatBoxState}
                chatroomPreferences={chatBoxState.roomInfo}
              />
            )}
          </>
        ) : (
          <>
            {chatBoxState.level === 100 ? (
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
            ) : chatBoxState?.level === 101 && (
              <Createchatroom
                userId={userId}
                usersList={data?.listUsers}
                chatBoxState={chatBoxState}
                handleChatBoxState={handleChatBoxState}
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
