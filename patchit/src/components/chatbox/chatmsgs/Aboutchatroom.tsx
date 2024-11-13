import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';

import { defaultCPic, defaultUPic } from '../../../utils/helpers';
import { useLogged } from '../../../utils/hooks/useAuth';

//components
import Loadingpage from '../../Loadingpage';

//queries
import { UPSERTUSERPREFERENCES } from '../../../containers/profileSettings/queries';

//css & types
import "../css/aboutchatroom.css";
import { aboutchatroompropstype } from '../types';
import { usernametype } from '../../../utils/main/types';
import { defaultUserPic } from '../../../constants/const';
import { loggedusercontexttype } from '../../../context/types';

function Aboutchatroom(aboutchatroomprops: aboutchatroompropstype) {
  const { userId, setChatLevel, handleDelete, chatroomInfo } = aboutchatroomprops;

  const navigate = useNavigate();
  const { loggedUser }: loggedusercontexttype = useLogged();

  //states
  const [showInmates, setShowInmates] = useState<boolean>(false);

  //queries
  const [updateUserSettings] = useMutation(UPSERTUSERPREFERENCES);

  //handlers
  const handleBlock: (blockUname: string) => Promise<void> = async (blockUname: string) => {
    const blockUsernames: string[] = loggedUser?.blocked ?
      [...JSON.parse(loggedUser?.blocked), blockUname] :
      [blockUname];

    await updateUserSettings({
      variables: {
        data: {
          user_id: userId!,
          blocked: JSON.stringify(blockUsernames)
        }
      }
    });
  }

  if (!chatroomInfo) {
    return (<Loadingpage />)
  } else {
    return (
      <div className="aboutchatuser">
        <div className="aboutchatuserpicwrapper">
          <img
            alt="userpic"
            className="aboutchatuserpic"
            src={chatroomInfo?.isRoom
              ? chatroomInfo?.profile_pic
              : defaultUserPic
            }
            onError={chatroomInfo?.isRoom ? defaultCPic : defaultUPic}
          />
        </div>
        <div
          className="chataboutusername"
          onClick={chatroomInfo?.isRoom
            ? () => setChatLevel(0)
            : () => navigate(`/u/${chatroomInfo.roomName}`)
          }
        >
          {chatroomInfo.roomName}
        </div>
        {chatroomInfo?.about && (
          <div className="chataboutuserabout">
            {chatroomInfo?.about}
          </div>
        )}
        <div className="aboutchatuseroptions">
          <div
            className="aboutchatuseroption waves-effect waves-light"
            onClick={chatroomInfo?.isRoom ?
              () => setShowInmates(!showInmates) :
              () => navigate(`/u/${chatroomInfo.roomName}`)
            }
          >
            <i className="material-icons aboutchatuseroptionicn">
              {chatroomInfo?.isRoom ? "people_outline" : "perm_identity"}
            </i>
            {chatroomInfo?.isRoom ? "inmates" : "profile"}
          </div>
          {(chatroomInfo?.isRoom && (userId === chatroomInfo?.ownerId)) && (
            <div className="aboutchatuseroption waves-effect waves-light" onClick={() => setChatLevel(2)}>
              <i className="material-icons aboutchatuseroptionicn">
                settings
              </i>
              settings
            </div>
          )}
          <div className="aboutchatuseroption blue-text waves-effect waves-light" onClick={() => setChatLevel(0)}>
            <i className="material-icons aboutchatuseroptionicn"> chat </i>
            chat
          </div>
          {!chatroomInfo?.isRoom && (
            <div
              onClick={() => handleBlock(chatroomInfo.roomName)}
              className="aboutchatuseroption red-text waves-effect waves-light"
            >
              <i className="material-icons aboutchatuseroptionicn"> block </i>
              Block
            </div>
          )}
          <div className="aboutchatuseroption red-text waves-effect waves-light" onClick={handleDelete}>
            <i className="material-icons aboutchatuseroptionicn">
              {chatroomInfo?.isRoom ? "exit_to_app" : "delete_forever"}
            </i>
            {chatroomInfo?.isRoom ? "leave" : "delete"}
          </div>
        </div>
        {showInmates && (
          <div className="showinmates">
            <div className="inmateboxtitle">
              <i className="material-icons inmateboxtitleicn">
                people_outline
              </i>
              inmates
            </div>
            <div className="inmateboxbody">
              {chatroomInfo?.users?.map((user: usernametype, idx: number) => (
                <Link to={`/u/${user.username}`} key={idx} className="inmateprofile">
                  <div className="inmatepicwrapper">
                    <img
                      alt={"user_pic"}
                      className="inmatepic"
                      src={user.profile_pic}
                      onError={defaultUPic}
                    />
                  </div>
                  <div className="inmatename">
                    {user.username}
                  </div>
                  {user.id === chatroomInfo?.ownerId && (
                    <i className="material-icons grpownericn blue-text" title="admin">
                      memory
                    </i>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default Aboutchatroom;