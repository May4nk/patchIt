import React from 'react';

import { defaultUPic } from '../../../utils/helpers';

//components
import Askinput from '../../html/Askinput';
import Chatgroupcard from './Chatgroupcard';

//css, image & types
import "../css/chatmsgs.css";
import { chatgroupusertype, createchatroompropstype } from '../types';

function Createchatroom(createchatroomprops: createchatroompropstype) {
  const {
    userId,
    roomName,
    usersList,
    createRoom,
    setRoomName,
    setChatLevel,
    usernameSearch,
    chatgroupUsers,
    setUsernameSearch,
    setChatgroupUsers,
    handleDefaultState,
    handleCreateChatroom
  } = createchatroomprops;

  //handlers
  const clearState = () => {
    setRoomName("");
    setUsernameSearch("");
    setChatgroupUsers([]);
    handleDefaultState(true);
    setChatLevel(100);
  }

  const handleSelectedUsers: (user: chatgroupusertype) => void = (user: chatgroupusertype) => {
    if (createRoom) {
      setChatgroupUsers([...chatgroupUsers, user]);
      setUsernameSearch("");
    } else {
      setUsernameSearch(user.username);
      setChatgroupUsers([user]);
    }
  }

  const foundusernames: chatgroupusertype[] = usersList.filter((user: chatgroupusertype) => {
    return user?.username.startsWith(usernameSearch) && (user?.id !== userId) &&
      !chatgroupUsers.find((usr: chatgroupusertype) => (
        usr.id === user?.id
      ))
  });

  return (
    <>
      <div className="createroom">
        <Askinput
          required={true}
          value={usernameSearch}
          placeholder={"Search User"}
          onChange={(e) => setUsernameSearch(e.target.value)}
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
            <div
              key={idx}
              onClick={() => handleSelectedUsers(user)}
              className="foundedusernames waves-light waves-effect"
            >
              <div className="foundeduserpicwrapper">
                <img
                  alt="users pic"
                  className="foundeduserpic"
                  src={user.profile_pic}
                  onError={defaultUPic}
                />
              </div>
              {user.username}
            </div>
          ))
        )}
      </div>
      <div className="acceptroom">
        <div
          onClick={() => clearState()}
          className="waves-effect waves-light red lighten-1 black-text acceptroombtn"
        >
          cancel
        </div>
        <div
          onClick={() => handleCreateChatroom()}
          className={`waves-effect waves-light acceptroombtn`}
        >
          Create
        </div>
      </div>
    </>
  )
}

export default Createchatroom;