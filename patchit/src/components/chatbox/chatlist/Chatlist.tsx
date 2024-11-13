import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";

import { useAuth } from "../../../utils/hooks/useAuth";

//queries
import { GETNOTIFICATIONS, SUBSCRIBETONOTIFICATION } from "../../navbar/queries";

//component
import Chatrequest from "./Chatrequest";
import Chatprofiles from "./Chatprofiles";
import Loadingpage from "../../Loadingpage";

//css, images & types
import "../css/chatlist.css";
import { usernametype } from "../../../utils/main/types";
import { authcontexttype } from "../../../context/types.js";
import { chatlistpropstype, chattertype, userchatroomtype } from "../types.js";
import {
  notificationdatatype,
  notificationprevtype,
  notificationtype,
  notificitionsubdatatype
} from "../../navbar/types";
const logo = require("../../../img/loading_logo.png");

const Chatlist = (chatlistprops: chatlistpropstype) => {
  const {
    newChat,
    chatrooms,
    handleActiveRoom,
    setChatgroupUsers,
    setUsernameSearch,
    handleCreateChatroom,
  } = chatlistprops;

  const { user }: authcontexttype = useAuth();
  const userId: number | null = user && Number(user["id"]);

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
      onError: (err: any) => console.log(err),
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

          return {
            listNotifications: [...newPendingNotifications, ...filteredNotifications]
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
        } else {
          setNotifiy(false);
          setChatNotification(false);
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
              <div
                className="newchatroomrequest waves-effect waves-light"
                onClick={() => setChatNotification(!chatNotification)}
              >
                <div className="chatrequesttext">
                  New
                </div>
                <img src={logo} alt="pic" className="newchatrequestwrapperimg" />
              </div>
            </div>
            {(!error && chatNotification) && (
              <div className="newchatrequests">
                {!loading ? (
                  data?.listNotifications.map((notification: notificationtype, idx: number) => (
                    <Chatrequest
                      key={idx}
                      notification={notification}
                      setChatgroupUsers={setChatgroupUsers}
                      setUsernameSearch={setUsernameSearch}
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
        <div className="newroombtn waves-effect waves-light" onClick={() => newChat(true)}>
          New Room
        </div>
        <div className="newchatbtn waves-effect waves-light" onClick={() => newChat(false)}>
          Start Chat
        </div>
      </div>
    </div>
  )
}

export default Chatlist;

