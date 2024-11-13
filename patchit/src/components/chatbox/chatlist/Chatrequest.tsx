import React, { useEffect } from 'react';
import { useMutation } from '@apollo/client';

//utils
import { defaultUPic } from '../../../utils/helpers';

//queries
import { UPDATENOTIFICATION } from '../../navbar/queries';

//types
import { chatgroupusertype, chatrequestpropstype } from '../types';

function Chatrequest(chatrequestprops: chatrequestpropstype) {
  const { notification, handleCreateChatroom, setChatgroupUsers, setUsernameSearch } = chatrequestprops;

  //queries
  const [upsertNotification] = useMutation(UPDATENOTIFICATION);

  //handlers
  const handleChatReq: (res: boolean) => void = async (res: boolean) => {
    try {
      if (res) {
        await handleCreateChatroom();
      }

      await upsertNotification({
        variables: {
          data: {
            id: notification.id,
            status: res ? "ACCEPT" : "REJECT"
          }
        }
      })
    } catch (err) {
      console.log(err);
    }

    setChatgroupUsers([]);
    setUsernameSearch("");
  }

  useEffect(() => {
    if (notification) {
      const requestedUser: chatgroupusertype = notification.fromuser;
      setChatgroupUsers([requestedUser]);
      setUsernameSearch(requestedUser.username);
    }
  }, [notification]);

  return (
    <div className="newchatrequest">
      <div className="newchatrequestabtuser">
        <div className="newchatrequestuserpicwrapper">
          <img
            alt="user_dp"
            className="newchatrequestuserpic"
            src={notification.fromuser.profile_pic}
            onError={defaultUPic}
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
        <div
          onClick={() => handleChatReq(true)}
          className="newroombtn waves-effect waves-light blue-text"
        >
          accept
        </div>
        <div
          onClick={() => handleChatReq(false)}
          className="newroombtn waves-effect waves-light red-text"
        >
          reject
        </div>
      </div>
    </div>
  )
}

export default Chatrequest;