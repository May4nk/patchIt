import React from 'react';

//components
import Patbtn from '../../../html/Patbtn';
import Askinput from '../../../html/Askinput';
import Chatgroupcard from './Chatgroupcard';

//css, image & types
import "../../css/chatmsgs.css";
import { defaultUserPic } from '../../../../constants/const';
import { defaultUPic } from '../../../../utils/helpers/helpers';
import { chatgroupusertype, createchatroompropstype } from '../../types';

function Createchatroom(createchatroomprops: createchatroompropstype) {
  const {
    userId,
    usersList,
    chatBoxState,
    handleDefaultState,
    handleChatBoxState,
    handleCreateChatroom
  } = createchatroomprops;

  //handlers
  const handleSelectedUsers: (user: chatgroupusertype) => void = (user: chatgroupusertype) => {
    if (chatBoxState?.createRoom) {
      handleChatBoxState({ type: "ADD_ROOM_USER", user });
      handleChatBoxState({ type: "SEARCH_USERNAME", username: "" });
    } else {
      handleChatBoxState({ type: "SEARCH_USERNAME", username: user.username });
      handleChatBoxState({ type: "ADD_ROOM_USER", user });
    }
  }

  const foundusernames: chatgroupusertype[] = usersList.filter((user: chatgroupusertype) => {
    return user?.username.startsWith(chatBoxState?.searchUsername) && (user?.id !== userId) &&
      !chatBoxState?.roomUsers.find((usr: chatgroupusertype) => (
        usr.id === user?.id
      ))
  });

  return (
    <>
      <div className="createroom">
        <Askinput
          required={true}
          placeholder={"Search User"}
          value={chatBoxState?.searchUsername}
          onChange={(e) => handleChatBoxState({ type: "SEARCH_USERNAME", username: e.target.value })}
        />
      </div>
      {chatBoxState.searchUsername.length === 0 && (
        <div className="searchusernametxt">
          {!chatBoxState?.createRoom ?
            "Patch things here, Search User by username." :
            "Search & select your inmates."
          }
        </div>
      )}
      {(chatBoxState?.createRoom && chatBoxState?.roomUsers.length > 0) && (
        <div className="roomcreation">
          <Chatgroupcard
            roomName={chatBoxState?.name}
            chatgroupUsers={chatBoxState?.roomUsers}
            handleChatBoxState={handleChatBoxState}
          />
        </div>
      )}
      <div className="suggestedusername">
        {chatBoxState?.searchUsername.length !== 0 && (
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
                  src={user?.profile_pic || defaultUserPic}
                  onError={defaultUPic}
                />
              </div>
              {user.username}
            </div>
          ))
        )}
      </div>
      <div className="createroombtns">
        <Patbtn
          text={"cancel"}
          state={"clear"}
          handleClick={() => handleDefaultState(false)}
        />
        <Patbtn
          text={"create"}
          state={"selected"}
          handleClick={() => handleCreateChatroom()}
        />
      </div>
    </>
  )
}

export default Createchatroom;