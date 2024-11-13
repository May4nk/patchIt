import React, { useEffect, useRef } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";

import { defaultUPic } from "../../utils/helpers";
import { useAuth } from "../../utils/hooks/useAuth";

//component
import Loadingpage from "../Loadingpage";

//queries
import { GETNOTIFICATIONS, SUBSCRIBETONOTIFICATION, UPDATENOTIFICATION, FOLLOWUSER } from "./queries";

//css & types
import "./css/notificationdrop.css";
import { authcontexttype } from "../../context/types";
import {
  handleNotificationtype,
  notificationdatatype,
  notificationdroppropstype,
  notificationprevtype,
  notificationtype,
  notificitionsubdatatype
} from "./types";

const Notificationdrop = (notificationdropprops: notificationdroppropstype) => {
  const { isNewNotification, showNotificationdrop, setShowNotificationdrop } = notificationdropprops;
  const show: string = showNotificationdrop ? "block" : "none";

  const { user }: authcontexttype = useAuth();
  const userId: number | null = user && Number(user["id"]);
  const notificationRef = useRef<HTMLDivElement>(null);

  //queries & mutations
  const [followUser] = useMutation(FOLLOWUSER);
  const [updateNotification] = useMutation(UPDATENOTIFICATION);
  const [getNotifications, { data, loading, subscribeToMore }] = useLazyQuery(GETNOTIFICATIONS);

  //handlers
  const closeDrop: (e: any) => void = (e: any) => {
    if (notificationRef.current
      && showNotificationdrop
      && !notificationRef.current.contains(e.target)
    ) {
      setShowNotificationdrop(false)
    }
  }

  document.addEventListener('mousedown', closeDrop);

  const handleNotification: handleNotificationtype = async (notification: notificationtype, notifyRes: boolean) => {
    try {
      if (notifyRes) {
        await followUser({
          variables: {
            data: {
              following: userId,
              follower: notification.fromuser.id,
            }
          },
        });
      }

      await updateNotification({
        variables: {
          data: {
            id: notification.id,
            status: notifyRes ? "ACCEPT" : "REJECT"
          }
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    let unsubscribe = subscribeToMore({
      document: SUBSCRIBETONOTIFICATION,
      variables: { type: "FRIEND", userId: userId },
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

          if (!showNotificationdrop && newPendingNotifications.length > 0) {
            isNewNotification((prev) => ({ ...prev, notification: true }));
          }

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
    if (userId && showNotificationdrop) {
      getNotifications({
        variables: {
          filter: {
            status: "PENDING",
            touser: userId
          }
        }
      });
    }
  }, [showNotificationdrop]);

  return (
    <div className={`notificationdrop ${show}`} ref={notificationRef}>
      <div className="notificationdropcontent">
        <div className="notificationdropheader">
          <div className="notificationdropheadertitle"> Notifications </div>
          <div className="notificationdropheaderactions">
            <i className="material-icons notificationdropheadericn"> email </i>
            <i className="material-icons-outlined notificationdropheadericn"> settings </i>
          </div>
        </div>
        <div className="notificationdropbody">
          {loading ? (
            <Loadingpage />
          ) : (
            data?.listNotifications.length > 0 ? (
              data?.listNotifications.map((notification: notificationtype, idx: number) => (
                <div key={idx} className="notifies">
                  <div className="notifiesbodywrapper">
                    <div className="notifiespicwrapper">
                      <img
                        src={notification?.fromuser?.profile_pic}
                        className="notifiespic"
                        alt={"notification_pic"}
                        onError={defaultUPic}
                      />
                    </div>
                    <div className="notifiesbody">
                      <div className="notifiestitle"> {notification.type} </div>
                      <div className="notifiesmessage"> {notification.message} </div>
                    </div>
                    {notification.status === "PENDING" && (
                      <div className="notifiesactions">
                        <div
                          className="notificationactionbtn blue-text waves-effect waves-light"
                          onClick={() => handleNotification(notification, true)}
                        >
                          accept
                        </div>
                        <div
                          className="notificationactionbtn red-text waves-effect waves-light"
                          onClick={() => handleNotification(notification, false)}
                        >
                          reject
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="notificationdropmessage">
                This seems empty
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default Notificationdrop;