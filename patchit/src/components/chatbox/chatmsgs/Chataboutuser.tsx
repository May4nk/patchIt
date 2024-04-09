import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useLogged } from '../../../common/hooks/useAuth';
//components
import Loadingpage from '../../Loadingpage';
import { UPSERTUSERPREFERENCES } from '../../../containers/queries/profilesetting';
//css & types
import "../css/chataboutuser.css";
import { loggedusercontexttype } from '../../../context/types';
import { activeroomtype, userchatroomtype, usertype } from '../types';
const pic = require("../../../img/unnamed.jpg");
interface chataboutuserprops {
  userId: number;
  activeRoom: activeroomtype;
  setChatLevel: React.Dispatch<React.SetStateAction<number>>;
  handleDelete: () => void;
  chatroomInfo: userchatroomtype | undefined;
}

function Chataboutuser(chataboutuserprops: chataboutuserprops) {
  const { userId, activeRoom, setChatLevel, handleDelete, chatroomInfo } = chataboutuserprops;

  const navigate = useNavigate();
  const { loggedUser }: loggedusercontexttype = useLogged();
  //states
  const [showInmates, setShowInmates] = useState<boolean>(false);
  const [isGroup, setIsGroup] = useState<boolean>(false);
  //queries
  const [updateUserSettings] = useMutation(UPSERTUSERPREFERENCES);
  //handlers
  const roomUsers: usertype[] | undefined  = chatroomInfo  &&
    chatroomInfo?.users?.filter((usr: usertype) => {
      return usr.id !== userId
    });
  
  const handleBlock: (blockUname: string) => void = (blockUname: string) => {
    const blockUsernames: string[] = loggedUser?.blocked ? 
      [...JSON.parse(loggedUser?.blocked), blockUname] :
      [blockUname];
    updateUserSettings({
      variables: {
        data: {
          user_id: userId!,
          blocked: JSON.stringify(blockUsernames)
        }    
      }
    })
  }  

  useEffect(() => {
    if(chatroomInfo) {
      setIsGroup(chatroomInfo?.users?.length > 2)
    }
  }, [chatroomInfo])

  if (!chatroomInfo) {
    return (<Loadingpage />)
  } else {
    return (
      <div className="aboutchatuser">
        <div className="aboutchatuserpicwrapper">
          <img src={pic} alt="userpic" className="aboutchatuserpic" />
        </div>
        <div className="chataboutusername">
          {activeRoom.username}
        </div>
        <div className="chataboutuserabout">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis aperiam.
        </div>
        <div className="aboutchatuseroptions">
          <div className="aboutchatuseroption waves-effect waves-light"
            onClick={isGroup ?
              () => setShowInmates(!showInmates) :
              () => navigate(`/u/${activeRoom.username}`)
            }
          >
            <i className="material-icons aboutchatuseroptionicn">
              {isGroup ? "people_outline" : "perm_identity"}
            </i>
            {isGroup ? "inmates" : "profile"}
          </div>
          <div className="aboutchatuseroption blue-text waves-effect waves-light" onClick={() => setChatLevel(0)}>
            <i className="material-icons aboutchatuseroptionicn"> chat </i>
            chat
          </div>
          { !isGroup && (
            roomUsers && (
              <div className="aboutchatuseroption red-text waves-effect waves-light" 
                onClick={() => handleBlock(roomUsers[0]?.username)}
              >
                <i className="material-icons aboutchatuseroptionicn"> block </i>
                Block
              </div>
            )
          )}
          <div className="aboutchatuseroption red-text waves-effect waves-light" onClick={handleDelete}>
            <i className="material-icons aboutchatuseroptionicn">
              {isGroup ? "exit_to_app" : "delete_forever"}
            </i>
            {isGroup ? "leave" : "delete"}
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
              {roomUsers && roomUsers?.map((user: usertype, idx: number) => (
                <div className="inmateprofile" key={idx} onClick={() => navigate(`/u/${user.username}`)}>
                  <div className="inmatepicwrapper">
                    <img src={pic} alt={"user_pic"} className="inmatepic" />
                  </div>
                  <div className="inmatename">
                    {user.username}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default Chataboutuser;