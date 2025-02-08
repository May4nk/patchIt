//css & types
import "../css/chatlist.css";
import { chatprofileprops, messagetexttype } from "../types";
import { defaultUPic } from "../../../utils/helpers/helpers";
import { defaultCommunityPic, defaultUserPic } from "../../../constants/const";

const Chatprofiles = (chatprofileprops: chatprofileprops) => {
  const { handleActiveRoom, chatroom } = chatprofileprops;

  //constants
  const username: string = chatroom?.users.length === 1 ? chatroom.users[0].username : chatroom.room.roomName;
  const message: messagetexttype | null = chatroom.message ? JSON.parse(chatroom.message) : null;
  const userDp = chatroom.users.length === 1
    ? (chatroom.users[0].profile_pic || defaultUserPic)
    : (defaultCommunityPic);

  return (
    <div
      className="chatters" id={`${chatroom.room.id}`}
      onClick={() => handleActiveRoom(chatroom.room.id)}
    >
      <div className="chatterspicwrapper">
        <img
          src={userDp}
          className="chatterspic"
          alt="chatter_pic"
          onError={defaultUPic}
        />
      </div>
      <div className="chatterstext">
        <div className="chatterstextprofile">
          {username}
        </div>
        <div className="chatterstextmsg">
          {message ?
            message?.txt ?
              message?.txt.length > 27 ? `${message?.txt?.substr(0, 30)}...` : message.txt
              : "Img"
            : `Open to patch...`
          }
        </div>
      </div>
    </div>
  )
}

export default Chatprofiles;