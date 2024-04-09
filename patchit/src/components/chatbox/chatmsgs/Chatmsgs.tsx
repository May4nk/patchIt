import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
//components
import Message from "./Message";
import Chatoptions from "./Chatoptions";
import Chataboutuser from "./Chataboutuser";
import Askinput from "../../html/Askinput";
import Chatgroupcard from "./Chatgroupcard";
//queries
import {
  INSERTMSG,
  CREATECHATROOM,
  INSERTUSERCHATROOM,
  SUBSCRIBETONEWMSG,
  GETALLMSGS,
  DELETECHATROOM,
  GETALLUSERS,
} from "../queries";
//css & types
import "../css/chatmsgs.css";
import {
  activeroomtype,
  chatgroupusertype,
  chatmsgsprops,
  messagestatetype,
  messagetype,
  roomtype,
  userchatroomtype,
} from "../types";

const pic = require("../../../img/unnamed.jpg");

const Chatmsgs = (chatmsgsprops: chatmsgsprops) => {
  const {
    userId,
    chatLevel,
    setChatLevel,
    activeRoom,
    setActiveRoom,
    createRoom,
    setCreateRoom,
    setShowChatbox,
    handleActiveRoom,
    chatrooms
  } = chatmsgsprops;

  const [roomName, setRoomName] = useState<string>("");
  const [showGroup, setShowGroup] = useState<boolean>(false);
  const [usernameSearch, setUsernameSearch] = useState<string>("");
  const [showChatoptions, setShowChatOptions] = useState<boolean>(false);
  const [chatgroupUsers, setChatgroupUsers] = useState<chatgroupusertype[]>([]);
  const [activeroomInfo, setActiveRoomInfo] = useState<userchatroomtype>();
  const [message, setMessage] = useState<messagestatetype>({
    user_id: userId!,
    message: "",
    room_id: activeRoom.roomId!
  });

  const [insertMessage] = useMutation(INSERTMSG);
  const [createChatroom] = useMutation(CREATECHATROOM);
  const [deleteChatroom] = useMutation(DELETECHATROOM);
  const [insertUserChatroom] = useMutation(INSERTUSERCHATROOM);
  const [getUser, { data: allUsersData }] = useLazyQuery(GETALLUSERS);
  const { data: roomMsgsData, subscribeToMore: subscribeToMoreMessages } = useQuery(GETALLMSGS, {
    variables: {
      filter: {
        room_id: activeRoom.roomId!
      }
    }
  });

  //handlers
  const handleDelete: () => void = () => {
    deleteChatroom({
      variables: {
        data: {
          room_code: activeRoom.roomId
        }
      }
    })
  }

  const handleDefaultState: (def: boolean) => void = (def: boolean) => {
    if (!def) {
      setShowChatbox(false);
    }
    setChatLevel(0);
    setChatgroupUsers([]);
    setShowGroup(false);
    setUsernameSearch("");
    setCreateRoom(false);
    setRoomName("");
    setActiveRoom({ username: "", roomId: "" });
  }

  const handleNewChat: () => void = () => {
    setCreateRoom(false);
    setShowGroup(false);
    setUsernameSearch("");
    setChatLevel(1);
    setChatgroupUsers([]);
    setRoomName("");
  }

  const handleMessageInput: (e: any) => void = (e: any) => {
    setMessage({
      ...message,
      [e.target.name]: e.target.value
    });
  }

  const foundusernames: chatgroupusertype[] = allUsersData?.listUsers.filter((user: chatgroupusertype) => {
    return user?.username.startsWith(usernameSearch) && (user?.id !== userId) &&
      !chatgroupUsers.find((usr: chatgroupusertype) => (
        usr.id === user?.id
      ))
  });

  const handleSubmitMessage: (e: any) => void = (e: any) => {
    e.preventDefault();
    if (message.message.length > 0) {
      insertMessage({
        variables: {
          data: message
        }
      })
    }
    setMessage({
      ...message,
      message: ""
    });
  }

  const handleCreateChatroom: () => void = () => {
    if (chatgroupUsers.length > 0) {
      if (createRoom && roomName.length === 0) {
        return;
      }
      createChatroom({
        variables: {
          data: {
            room_code: !createRoom ? `${userId}-${chatgroupUsers[0].id}` : roomName,
          }
        },
        onError: ({ message }: { message: string }) => {
          if (message.includes("Chatroom already Exist")) {
            const room_code = message.substring(message.indexOf(":"));
            const activeRoom: activeroomtype = {
              username: usernameSearch,
              roomId: room_code?.substring(2,)
            }
            handleActiveRoom(activeRoom.username, activeRoom);
            setUsernameSearch("");
          };
        },
        onCompleted: ({ insertChatroom }: { insertChatroom: roomtype }) => {
          if (insertChatroom) {
            const room_code: string = insertChatroom.room_code;
            const roomUsers: { user_id: number, room_id: string }[] = chatgroupUsers.map((user: chatgroupusertype) => {
              return {
                user_id: user.id,
                room_id: roomName
              }
            });
            insertUserChatroom({
              variables: {
                data: !createRoom ? [
                  { user_id: userId, room_id: room_code },
                  { user_id: Number(chatgroupUsers[0].id), room_id: room_code }
                ] : [
                  { user_id: userId, room_id: room_code },
                  ...roomUsers
                ]
              }
            });
            const activeRoom: activeroomtype = {
              username: !createRoom ? usernameSearch : roomName,
              roomId: insertChatroom?.room_code
            };
            handleActiveRoom(activeRoom.username, activeRoom);
            setChatgroupUsers([]);
            setUsernameSearch("");
            setRoomName("");
          }
        }
      });
    }
  }

  const handleSelectedUsers: (user: chatgroupusertype) => void = (user: chatgroupusertype) => {
    if (createRoom) {
      setChatgroupUsers([...chatgroupUsers, { id: user.id, username: user.username }]);
    } else {
      setUsernameSearch(user.username);
      setChatgroupUsers([{ id: user.id, username: user.username }]);
    }
  }

  useEffect(() => {
    if (activeRoom.username.length !== 0) {
      const userInfo: userchatroomtype[] = chatrooms.filter((room: userchatroomtype) => {
        return room?.room_id.room_code === activeRoom.roomId
      })
      setActiveRoomInfo(userInfo[0]);
    }
  }, [activeRoom.username])

  useEffect(() => {
    if (usernameSearch.length !== 0) {
      getUser({
        variables: {
          filter: {
            "status": "ACTIVE",
          }
        }
      });
    }
  }, [usernameSearch]);

  useEffect(() => {
    let unsubscribe = subscribeToMoreMessages({
      document: SUBSCRIBETONEWMSG,
      variables: { filter: { room_id: activeRoom.roomId! } },
      onError: err => console.log("msg", err),
      updateQuery: (prev: any, { subscriptionData }: any) => {
        if (!subscriptionData.data) return prev;
        const newChatMessage = subscriptionData.data.newMessage;
        return {
          listMessages: [...prev?.listMessages, ...newChatMessage]
        }
      }
    })

    if (unsubscribe) return () => unsubscribe();

  }, [subscribeToMoreMessages, activeRoom]);

  useEffect(() => {
    if (activeRoom.roomId.length !== 0) {
      setMessage({
        ...message,
        room_id: activeRoom.roomId
      })
    }
  }, [activeRoom.roomId]);

  return (
    <div className="rchatcontainer">
      <div className="chattitle">
        {chatLevel === 1 ? (
          createRoom ? "Create Room" : "Start Chat"
        ) : activeRoom.roomId.length !== 0 ? (
          <div className="chatuserpage" onClick={() => setChatLevel(200)}>
            {activeRoom.username}
          </div>
        ) : ("")}
        <div className="chattitleicnwrapper">
          {activeRoom.roomId.length !== 0 && (
            <Chatoptions
              showChatoptions={showChatoptions}
              setShowChatOptions={setShowChatOptions}
              handleDelete={handleDelete}
            />
          )}
          <i className="material-icons tiny chattitleicn" onClick={() => handleDefaultState(false)}>
            clear
          </i>
        </div>
      </div>
      <div className="chatbody">
        {chatLevel === 1 ? (
          <>
            <div className="createroom">
              <Askinput
                placeholder={"Search User"}
                onChange={(e) => setUsernameSearch(e.target.value)}
                value={usernameSearch}
                required={true}
              />
            </div>
            {usernameSearch.length === 0 && (
              <div className="searchusernametxt">
                {!createRoom ?
                  "Patch things here, Search User by username." :
                  "Search & select your inmates."
                }
              </div>
            )}
            {(createRoom && chatgroupUsers.length > 0) && (
              <div className="roomcreation">
                <Chatgroupcard
                  roomName={roomName}
                  setRoomName={setRoomName}
                  chatgroupUsers={chatgroupUsers}
                  setChatgroupUsers={setChatgroupUsers}
                />
              </div>
            )}
            <div className="suggestedusername">
              {usernameSearch.length !== 0 && (
                foundusernames?.map((user: chatgroupusertype, idx: number) => (
                  <div className="foundedusernames waves-light waves-effect"
                    onClick={() => handleSelectedUsers(user)}
                    key={idx}
                  >
                    <div className="foundeduserpicwrapper">
                      <img src={pic} alt="users pic" className="foundeduserpic" />
                    </div>
                    {user.username}
                  </div>
                ))
              )}
            </div>
            <div className="acceptroom">
              <div
                className="waves-effect waves-light red lighten-1 black-text acceptroombtn"
                onClick={() => handleDefaultState(true)}
              >
                cancel
              </div>
              <div className="waves-effect waves-light acceptroombtn" onClick={handleCreateChatroom}>
                Create
              </div>
            </div>
          </>
        ) : chatLevel === 200 ? (
          <Chataboutuser
            userId={userId!}
            activeRoom={activeRoom}
            setChatLevel={setChatLevel}
            handleDelete={handleDelete}
            chatroomInfo={activeroomInfo}
          />
        ) : activeRoom?.roomId.length !== 0 ? (
          <>
            <div className="chat">
              {roomMsgsData?.listMessages.map((message: messagetype, idx: number) => (
                <Message
                  key={idx}
                  userId={userId!}
                  userInfo={message.user_id}
                  messageInfo={message}
                  chatroomInfo={activeroomInfo!}
                />
              ))}
            </div>
            <form className="chatform" onSubmit={handleSubmitMessage}>
              <i className="material-icons"> add_a_photo </i>
              <div className="messageinput">
                <Askinput
                  name={"message"}
                  placeholder={"Message"}
                  onChange={handleMessageInput}
                  value={message.message}
                />
              </div>
              <i className="material-icons chatsubmit" onClick={handleSubmitMessage}> send </i>
            </form>
          </>
        ) : (
          <div className="startnewchat">
            <div className="startnewchatpicwrapper">
              <img src={pic} className="startnewchatpic" alt="startnew" />
            </div>
            <div className="startnewchattext"> Welcome to Chat!!! </div>
            <div className="startnewchattext1"> Start patching things here... </div>
            <div className="startnewchatbtnwrapper">
              <div className="waves-effect waves-light startnewchatbtn" onClick={handleNewChat}>
                start chat
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chatmsgs;
