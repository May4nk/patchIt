import React, { useState, useEffect, useReducer } from "react";
import { useLazyQuery } from "@apollo/client";

import { useAuth } from "../../utils/hooks/useAuth";
import { generateRoomCode } from "../../utils/helpers";
import { chatInfoReducer, createNewChatroom, initialChatroomInfo, upsertChatPrefrences } from "../../utils/chatopx";

//components
import Chatlist from "./chatlist/Chatlist";
import Chatmsgs from "./chatmsgs/Chatmsgs";

//queries
import {
  GETCHATROOM,
  GETUSERCHATROOMS,
  SUBSCRIBETOUSERCHATROOMS,
} from "./queries";

//css & types
import "./css/chatbox.css";
import { ERRORTYPE, RESPONSETYPE } from "../../utils/main/types";
import { authcontexttype } from "../../context/types.js";
import { chatroominfotype, createchatroomrestype } from "../../utils/types";
import {
  chatroomtype,
  chatboxprops,
  activeroomtype,
  userchatroomtype,
  chatgroupusertype,
  userchatroomprevtype,
  userchatroomsubdatatype,
} from "./types.js";

const Chatbox = (chatboxprops: chatboxprops) => {
  const { isNewChat, showChatbox, setShowChatbox } = chatboxprops;
  const show: string = showChatbox ? "block" : "none";

  const { user }: authcontexttype = useAuth();
  const userId: number | null = user && Number(user["id"]);

  //states
  //chatLevels -> 100: default, 101: create chat/room, 0: chat, 1: about room, 2: room settings
  const [chatLevel, setChatLevel] = useState<number>(100);
  const [roomName, setRoomName] = useState<string>("");
  const [createRoom, setCreateRoom] = useState<boolean>(false);
  const [usernameSearch, setUsernameSearch] = useState<string>("");
  const [chatroomInfo, dispatch] = useReducer(chatInfoReducer, initialChatroomInfo);
  const [chatgroupUsers, setChatgroupUsers] = useState<chatgroupusertype[]>([]);
  const [error, setError] = useState<ERRORTYPE>({ show: false, status: 0, message: "" });
  const [activeRoom, setActiveRoom] = useState<activeroomtype>({
    roomId: "",
    users: 0
  });

  //queries
  const [getChatroom] = useLazyQuery(GETCHATROOM);
  const [getUserChatrooms, { data, subscribeToMore }] = useLazyQuery(GETUSERCHATROOMS);

  //handlers
  const newChat: (room: boolean) => void = (room: boolean = false) => {
    setCreateRoom(false);
    if (room) {
      setCreateRoom(true);
    }
    setActiveRoom({ roomId: "", users: 0 });
    setChatLevel(101);
  }

  const handleDefaultState: (def: boolean) => void = (def: boolean = true) => {
    if (!def) {
      setShowChatbox(false);
    }
    setRoomName("");
    setChatLevel(100);
    setCreateRoom(false);
    setUsernameSearch("");
    setChatgroupUsers([]);
    setActiveRoom({ roomId: "", users: 0 });
  }

  const handleActiveRoom: (room: activeroomtype) => void = (room: activeroomtype) => {
    const beenActiveRoom = document.querySelector(".activechatter");
    if (beenActiveRoom) {
      beenActiveRoom.classList.remove("activechatter");
    }

    const currentActiveRoom = document.getElementById(`${room.roomId}`);
    if (currentActiveRoom) {
      currentActiveRoom?.classList.add("activechatter");
    }

    setCreateRoom(false);
    setActiveRoom({ ...room });
    setChatLevel(0);
  }

  const handleCreateChatroom: () => Promise<RESPONSETYPE> = async () => {
    if (chatgroupUsers.length < 1) {
      return { status: 0, message: "No User choosen yet to chat with..." };
    }

    if (createRoom) {
      if (chatgroupUsers?.length < 2) {
        setError({
          show: true,
          status: 0,
          message: "Room should have 2 or more inmates"
        });

        return { status: 0, message: "Room should have 2 or more inmates" };
      }

      if (roomName?.length < 1) {
        setError({ show: true, status: 0, message: "Room name is required!" });
        return { status: 0, message: "Room name is required!" };
      }
    }

    let newRoom: createchatroomrestype;

    try {
      if (createRoom) {
        const roomCode = generateRoomCode([userId!, ...chatgroupUsers.map(user => user.id)], true);
        newRoom = await createNewChatroom(roomCode, Number(userId), chatgroupUsers, roomName);
        await upsertChatPrefrences(Number(userId), roomCode);
      } else {
        const roomCode = generateRoomCode([userId!, chatgroupUsers[0].id], false);
        newRoom = await createNewChatroom(roomCode, Number(userId), chatgroupUsers);
      }

      if (newRoom.status !== 200) {
        setError({ show: true, status: newRoom.status, message: "Something went wrong while creating chat." });
      }

      setRoomName("");
      setUsernameSearch("");
      setChatgroupUsers([]);
      handleActiveRoom(newRoom.room!);

      setError({ show: true, status: 200, message: "Happy patching!!!" });
      return { status: 200, message: "Chat created successfully" };
    } catch (err) {
      setError({ show: true, status: 500, message: "Something went wrong while creating chat." });
      return { status: 500, message: "Something went wrong while creating chat." };
    }
  }

  useEffect(() => {
    let unsubscribe = subscribeToMore({
      document: SUBSCRIBETOUSERCHATROOMS,
      variables: { userId: Number(userId) },
      onError: (err) => console.log(err),
      updateQuery: (prev: userchatroomprevtype, { subscriptionData }: userchatroomsubdatatype) => {
        const subdata = subscriptionData.data;
        if (!subdata) return prev;
        const newChatroom: userchatroomtype[] = subdata.newUserChatroom;
        if (newChatroom) {
          if (!showChatbox) {
            isNewChat((prev) => ({ ...prev, chat: true }));
          }
          return {
            listUserChatrooms: [newChatroom, ...prev?.listUserChatrooms]
          };
        }

        return {
          listUserChatrooms: [...(prev?.listUserChatrooms || [])]
        }
      },
    });

    if (unsubscribe) return () => unsubscribe();
  }, [subscribeToMore]);

  useEffect(() => {
    if (error.show) {
      setTimeout(() => {
        setError({ show: false, status: 0, message: "" });
      }, 3000)
    }
  }, [error]);

  useEffect(() => {
    getUserChatrooms({
      variables: {
        filter: {
          user_id: userId!
        }
      }
    });
  }, []);

  useEffect(() => {
    if (activeRoom.roomId) {
      getChatroom({
        variables: {
          chatroomId: activeRoom.roomId
        },
        onCompleted: ({ chatroom }: { chatroom: chatroomtype }) => {
          if (chatroom) {
            const activeRoomName = chatroom?.roomUsers?.length > 2
              ? chatroom.roomName
              : chatroom?.roomUsers.filter(user => user.id !== userId)[0]?.username;

            const chatSettings: chatroominfotype = {
              users: chatroom?.roomUsers,
              ownerId: chatroom?.owner.id,
              roomName: activeRoomName,
              room_code: chatroom?.room_code,
              isRoom: chatroom?.roomUsers.length > 2,
              about: chatroom?.chatpreference?.about || "",
              theme: chatroom?.chatpreference?.chatgrouptheme || "",
              blocked: chatroom?.chatpreference?.blocked ? JSON.parse(chatroom?.chatpreference?.blocked) : [],
              allowedMedia: chatroom?.chatpreference?.allowedmedia || "ALL",
              profile_pic: chatroom?.chatpreference?.group_profile || "",
              admin: chatroom?.chatpreference?.admin || "",
              co_admin: chatroom?.chatpreference?.co_admin || "",
              operator: chatroom?.chatpreference?.operator || "",
              acceptor: chatroom?.chatpreference?.acceptor || "",
            };

            dispatch({ type: "UPDATE", payload: chatSettings });
          }
        }
      });
    };
  }, [activeRoom]);

  return (
    <div className={show}>
      <div className={`chatbox ${chatLevel === 100 && "pandabackground"}`}>
        <div className="chatlist">
          <Chatlist
            newChat={newChat}
            handleActiveRoom={handleActiveRoom}
            chatrooms={data?.listUserChatrooms}
            setChatgroupUsers={setChatgroupUsers}
            setUsernameSearch={setUsernameSearch}
            handleCreateChatroom={handleCreateChatroom}
          />
        </div>
        <div className="chatmsgs">
          <Chatmsgs
            error={error}
            userId={userId}
            setError={setError}
            roomName={roomName}
            chatLevel={chatLevel}
            createRoom={createRoom}
            activeRoom={activeRoom}
            setRoomName={setRoomName}
            setChatLevel={setChatLevel}
            chatroomInfo={chatroomInfo}
            updateChatroomInfo={dispatch}
            chatgroupUsers={chatgroupUsers}
            usernameSearch={usernameSearch}
            handleActiveRoom={handleActiveRoom}
            setChatGroupUsers={setChatgroupUsers}
            setUsernameSearch={setUsernameSearch}
            handleDefaultState={handleDefaultState}
            handleCreateChatroom={handleCreateChatroom}
          />
        </div>
      </div>
    </div>
  )
}

export default Chatbox;
