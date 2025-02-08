import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';

//utils
import { defaultUPic } from '../../../utils/helpers/helpers';

//components
import Patbtn from '../../html/Patbtn';

//queries
import { UPDATENOTIFICATION } from '../../navbar/queries';

//types
import "../css/chatlist.css";
import { chatgroupusertype, chatrequestpropstype } from '../types';

function Chatrequest(chatrequestprops: chatrequestpropstype) {
  const { notification, handleCreateChatroom, handleChatBoxState } = chatrequestprops;

  //queries
  const [upsertNotification] = useMutation(UPDATENOTIFICATION);

  //states
  const [userInRoom, setUserInRoom] = useState<boolean>(false);

  //handlers
  const updateNotificationRes: (accept: boolean) => Promise<void> = async (accept: boolean) => {
    try {
      await upsertNotification({
        variables: {
          data: {
            id: notification.id,
            status: accept ? "ACCEPT" : "REJECT"
          }
        }
      })
    } catch (err) {
      handleChatBoxState({
        type: "SET_ERROR",
        error: {
          show: true,
          status: 500,
          message: "Try again: Something went wrong"
        }
      });
    }
  }

  const handleChatReq: (accept: boolean) => Promise<void> = async (accept: boolean) => {
    try {
      if (accept) {
        const requestedUser: chatgroupusertype = notification.fromuser;
        handleChatBoxState({ type: "ADD_ROOM_USER", user: requestedUser });

        setUserInRoom(true);
      } else {
        await updateNotificationRes(false);
        handleChatBoxState({ type: "RESET_ROOM_USERS" });
      }
    } catch (err) {
      handleChatBoxState({
        type: "SET_ERROR",
        error: {
          show: true,
          status: 500,
          message: "Try again: Something went wrong"
        }
      });

      handleChatBoxState({ type: "SOFT_RESET" });
      return;
    }
  }

  useEffect(() => {
    if (userInRoom) {
      const createChatroom = async () => {
        const chatroomCreated = await handleCreateChatroom();
        if (chatroomCreated.status !== 200) {
          handleChatBoxState({
            type: "SET_ERROR",
            error: {
              show: true,
              status: 500,
              message: "Try again: Something went wrong"
            }
          });
          return;
        }

        await updateNotificationRes(true);
        setUserInRoom(false);
      };

      createChatroom();
    }
  }, [userInRoom])

  return (
    <div className="newchatrequest">
      <div className="newchatrequestabtuser">
        <div className="newchatrequestuserpicwrapper">
          <img
            alt="user_dp"
            onError={defaultUPic}
            className="newchatrequestuserpic"
            src={notification.fromuser.profile_pic}
          />
        </div>
        <div className="newchatrequestuser">
          <div className="newchatrequestusername">
            {notification.fromuser.username}
          </div>
          <div className="newchatrequestuserbio">
            {notification?.message}
          </div>
        </div>
      </div>
      <div className="newchatrequestactions">
        <Patbtn
          text={"accept"}
          size={"small"}
          state={"selected"}
          handleClick={() => handleChatReq(true)}
        />
        <Patbtn
          text={"reject"}
          size={"small"}
          state={"clear"}
          handleClick={() => handleChatReq(false)}
        />
      </div>
    </div>
  )
}

export default Chatrequest;