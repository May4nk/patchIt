import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";

//utils
import { useAuth } from "../../../utils/hooks/useAuth";

//queries
import { GETNOTIFICATIONS, SUBSCRIBETONOTIFICATION } from "../../navbar/queries";

//component
import Patbtn from "../../html/Patbtn";
import Chatrequest from "./Chatrequest";
import Chatprofiles from "./Chatprofiles";
import Loadingpage from "../../Loadingpage";

//css, images & types
import "../css/chatlist.css";
import { authcontexttype } from "../../../context/types.js";
import { USER_S_N_TYPE, usernametype } from "../../../utils/main/types";
import { chatlistpropstype, chattertype, userchatroomtype } from "../types.js";
import {
  notificationdatatype,
  notificationprevtype,
  notificationtype,
  notificitionsubdatatype
} from "../../navbar/types";

const Chatlist = (chatlistprops: chatlistpropstype) => {
  const {
    chatrooms,
    chatBoxState,
    handleActiveRoom,
    handleChatBoxState,
    handleCreateChatroom,
  } = chatlistprops;

  const { user }: authcontexttype = useAuth();
  const userId: USER_S_N_TYPE = user && user["id"];

  //states
  const [notify, setNotifiy] = useState<boolean>(false);
  const [chatNotification, setChatNotification] = useState<boolean>(false);

  //queries
  const [getNotifications, { data, loading, error, subscribeToMore }] = useLazyQuery(GETNOTIFICATIONS);

  //handler
  const chatters: chattertype[] = chatrooms?.map((room: userchatroomtype) => {
    return {
      users: room?.users?.filter((usr: usernametype) => usr.id !== userId),
      room: room?.room_id,
      message: room?.lastMessage?.message
    }
  });

  useEffect(() => {
    let unsubscribe = subscribeToMore({
      document: SUBSCRIBETONOTIFICATION,
      variables: { type: "CHAT", userId: userId },
      onError: (err: any) => console.log("Error: fetching chat notifications failed"),
      updateQuery: (prev: notificationprevtype, { subscriptionData }: notificitionsubdatatype) => {
        const subdata: notificationdatatype = subscriptionData.data;
        if (!subdata) return prev;
        const newNotification: notificationtype[] = subdata?.newNotification;
        if (newNotification?.length > 0) {
          const filteredNotifications = prev?.listNotifications?.filter((notifier: notificationtype) => {
            return !newNotification.some((newNotifier: notificationtype) => newNotifier.id === notifier.id);
          }) || [];

          const newPendingNotifications = newNotification.filter(
            (newnotifier: notificationtype) => newnotifier.status === "PENDING"
          );

          const allPendingNotifications = [...filteredNotifications, ...newPendingNotifications];

          if (allPendingNotifications.length > 0) {
            setNotifiy(true);
          } else {
            setNotifiy(false);
          }

          return {
            listNotifications: allPendingNotifications
          };
        }

        return {
          listNotifications: [...(prev?.listNotifications || [])]
        };
      },
    });

    if (unsubscribe) return () => unsubscribe();
  }, [subscribeToMore]);

  useEffect(() => {
    getNotifications({
      variables: {
        filter: {
          type: "CHAT",
          touser: userId,
          status: "PENDING"
        }
      },
      onCompleted: ({ listNotifications }) => {
        if (listNotifications.length > 0) {
          setNotifiy(true);
        }
      }
    })
  }, [])

  return (
    <div className="lchatcontainer">
      <div className="rooms">
        {notify && (
          <>
            <div className="newchatrequestwrapper">
              <Patbtn
                text={"new"}
                size={"small"}
                icn={"chat_bubble_outline"}
                handleClick={() => setChatNotification(!chatNotification)}
              />
            </div>
            {(!error && chatNotification) && (
              <div className="newchatrequests">
                {!loading ? (
                  data?.listNotifications.map((notification: notificationtype, idx: number) => (
                    <Chatrequest
                      key={idx}
                      notification={notification}
                      handleChatBoxState={handleChatBoxState}
                      handleCreateChatroom={handleCreateChatroom}
                    />
                  ))
                ) : (
                  <Loadingpage />
                )}
              </div>
            )}
          </>
        )}
        {chatters?.map((chatroom: chattertype, idx: number) => (
          <Chatprofiles
            key={idx}
            chatroom={chatroom}
            handleActiveRoom={handleActiveRoom}
          />
        ))}
      </div>
      <div className="newroombtns">
        <Patbtn
          text={"new room"}
          handleClick={() => handleChatBoxState({ type: "NEW_CHAT", isRoom: true })}
          state={chatBoxState?.level === 101 ? chatBoxState?.createRoom ? "active" : "react" : "react"}
        />
        <Patbtn
          text={"Start Chat"}
          handleClick={() => handleChatBoxState({ type: "NEW_CHAT", isRoom: false })}
          state={chatBoxState?.level === 101 ? !chatBoxState?.createRoom ? "active" : "react" : "react"}
        />
      </div>
    </div>
  )
}

export default Chatlist;

