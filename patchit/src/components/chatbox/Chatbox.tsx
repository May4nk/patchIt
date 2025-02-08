import React, { useEffect, useReducer } from "react";
import { useLazyQuery } from "@apollo/client";

//utils
import { useAuth } from "../../utils/hooks/useAuth";
import { chatBoxInitState, createNewChatroom, handleChatBoxState, upsertChatPrefrences } from "../../utils/opx/chatopx";

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
import { authcontexttype } from "../../context/types.js";
import { createchatroomrestype } from "../../utils/types";
import { USER_S_N_TYPE } from "../../utils/main/types";
import {
  chatroomtype,
  chatboxprops,
  userchatroomtype,
  userchatroomprevtype,
  userchatroomsubdatatype,
  handledefaultstatetype,
  handleactiveroomtype,
  handlecreatechatroomtype,
  chatroominfotype,
} from "./types.js";

const Chatbox = (chatboxprops: chatboxprops) => {
  const { isNewChat, showChatbox, setShowChatbox } = chatboxprops;

  const show: string = showChatbox ? "block" : "none";
  const { user }: authcontexttype = useAuth();
  const userId: USER_S_N_TYPE = user && user["id"];
  const userName: USER_S_N_TYPE = user && user["username"];

  //state
  const [chatBoxState, dispatch] = useReducer(handleChatBoxState, chatBoxInitState);

  //queries
  const [getChatroom] = useLazyQuery(GETCHATROOM);
  const [getUserChatrooms, { data, subscribeToMore }] = useLazyQuery(GETUSERCHATROOMS);

  //handlers  
  const handleDefaultState: handledefaultstatetype = (toNull: boolean) => {
    dispatch({ type: "RESET" });
    if (toNull) {
      setShowChatbox(false);
    }
  }

  const handleActiveRoom: handleactiveroomtype = (roomId: string) => {
    const beenActiveRoom = document.querySelector(".activechatter");
    if (beenActiveRoom) {
      beenActiveRoom.classList.remove("activechatter");
    }

    const currentActiveRoom = document.getElementById(`${roomId}`);
    if (currentActiveRoom) {
      currentActiveRoom?.classList.add("activechatter");
    }

    dispatch({ type: "SET_ACTIVE_ROOMID", roomId });
  }

  const handleCreateChatroom: handlecreatechatroomtype = async () => {
    if (chatBoxState?.roomUsers.length === 0) {
      return { status: 0, message: "No User choosen yet to chat with..." };
    }

    if (chatBoxState?.createRoom) {
      if (chatBoxState?.roomUsers?.length < 2) {
        dispatch({
          type: "SET_ERROR",
          error: {
            show: true,
            status: 0,
            message: "Room should have 2 or more inmates"
          }
        });

        return { status: 0, message: "Room should have 2 or more inmates" };
      }

      if (chatBoxState?.name?.length < 1) {
        dispatch({
          type: "SET_ERROR",
          error: {
            show: true,
            status: 0,
            message: "Room name is required!"
          }
        });
        return { status: 0, message: "Room name is required!" };
      }
    }

    let newRoom: createchatroomrestype;

    try {
      if (chatBoxState?.createRoom) {
        newRoom = await createNewChatroom({
          ownerId: userId!,
          roomName: chatBoxState?.name,
          chatgroupUsers: chatBoxState?.roomUsers,
        });
      } else {
        newRoom = await createNewChatroom({
          ownerId: userId!,
          chatgroupUsers: chatBoxState?.roomUsers,
          roomName: `${userName}-${chatBoxState?.roomUsers[0].username}`,
        });
      }

      if (newRoom.status === 200) {
        if (chatBoxState?.createRoom) {
          await upsertChatPrefrences(userId!, newRoom?.roomId!);
        }

        dispatch({ type: "SET_ACTIVE_ROOMID", roomId: newRoom?.roomId! });
        dispatch({
          type: "SET_ERROR",
          error: {
            show: true,
            status: 200,
            message: "Happy patching!!!"
          }
        });

        return { status: 200, message: "Chat created successfully" };
      }

      dispatch({
        type: "SET_ERROR",
        error: {
          show: true,
          status: 500,
          message: "Try again: Unable to create chat"
        }
      });

      return { status: 500, message: "Try again: Unable to create chat" };
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        error: {
          show: true,
          status: 500,
          message: "Try again: Unable to create chat"
        }
      });

      return { status: 500, message: "Try again: Unable to create chat" };
    }
  }

  useEffect(() => {
    let unsubscribe = subscribeToMore({
      document: SUBSCRIBETOUSERCHATROOMS,
      variables: { userId: userId },
      onError: (err) => console.log("Error: fetch chat failed"),
      updateQuery: (prev: userchatroomprevtype, { subscriptionData }: userchatroomsubdatatype) => {
        const subdata = subscriptionData.data;
        if (!subdata) return prev;
        const newChatroom: userchatroomtype[] = subdata.newUserChatroom;
        if (newChatroom) {
          if (!showChatbox) {
            isNewChat(11);
          } else {
            isNewChat(0);
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
    if (chatBoxState?.error.show) {
      setTimeout(() => {
        dispatch({
          type: "SET_ERROR",
          error: { show: false, status: 0, message: "" }
        });
      }, 3000)
    }
  }, [chatBoxState?.error]);

  useEffect(() => {
    getUserChatrooms({
      variables: {
        filter: {
          user_id: userId!
        }
      }
    });
  }, [userId, getUserChatrooms]);

  useEffect(() => {
    if (showChatbox) {
      isNewChat(0);
    }
  }, [showChatbox])

  useEffect(() => {
    if (chatBoxState?.activeRoomId) {
      getChatroom({
        variables: {
          chatroomId: chatBoxState?.activeRoomId
        },
        onCompleted: ({ chatroom }: { chatroom: chatroomtype }) => {
          if (chatroom) {
            ///change
            const activeRoomName = chatroom?.roomUsers?.length > 2
              ? chatroom.roomName
              : chatroom?.roomUsers.filter(user => user.id !== userId)[0]?.username;

            const roomInfo: chatroominfotype = {
              users: chatroom?.roomUsers,
              ownerId: chatroom?.owner.id,
              name: activeRoomName,
              isRoom: chatroom?.roomUsers.length > 2,
              about: chatroom?.chatpreference?.about || "",
              theme: chatroom?.chatpreference?.chatgrouptheme || "",
              blockedUsers: chatroom?.chatpreference?.blocked ? JSON.parse(chatroom?.chatpreference?.blocked) : [],
              allowedMedia: chatroom?.chatpreference?.allowedmedia || "ALL",
              profile_pic: chatroom?.chatpreference?.group_profile || "",
              admin: chatroom?.chatpreference?.admin || "",
              co_admin: chatroom?.chatpreference?.co_admin || "",
              operator: chatroom?.chatpreference?.operator || "",
              acceptor: chatroom?.chatpreference?.acceptor || "",
            };

            dispatch({ type: "SET_ACTIVE_ROOMINFO", info: roomInfo });
          }
        }
      });
    };
  }, [chatBoxState?.activeRoomId]);

  return (
    <div className={show}>
      <div className={`chatbox ${chatBoxState?.level === 100 && "pandabackground"}`}>
        <div className="chatlist">
          <Chatlist
            chatBoxState={chatBoxState}
            handleChatBoxState={dispatch}
            handleActiveRoom={handleActiveRoom}
            chatrooms={data?.listUserChatrooms}
            handleCreateChatroom={handleCreateChatroom}
          />
        </div>
        <div className="chatmsgs">
          <Chatmsgs
            userId={userId!}
            chatBoxState={chatBoxState}
            handleChatBoxState={dispatch}
            handleDefaultState={handleDefaultState}
            handleCreateChatroom={handleCreateChatroom}
          />
        </div>
      </div>
    </div>
  )
}

export default Chatbox;
