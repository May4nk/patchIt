import {
  ERRORTYPE,
  idstype,
  RESPONSETYPE,
  usernametype,
} from "../../utils/main/types";
import { ACTION, chatroominfotype } from "../../utils/types";
import { newnotificationtiptype, notificationtype } from "../navbar/types";

export type allowedmediatype = "ALL" | "IMAGES" | "VIDEOS";

export interface roomtype {
  id: number;
  room_code: string;
  roomName: string;
  owner: usernametype;
}

export interface userchatroomtype {
  id: number;
  room_id: roomtype;
  users: usernametype[];
  lastMessage: { message: string };
}

export interface chatboxprops {
  showChatbox: boolean;
  setShowChatbox: React.Dispatch<React.SetStateAction<boolean>>;
  isNewChat: React.Dispatch<React.SetStateAction<newnotificationtiptype>>;
}

export interface activeroomtype {
  roomId: string;
  users: number;
}

type handleactiveroomtype = (room: activeroomtype) => void;

type userchatroomsubtype = {
  data: { newUserChatroom: userchatroomtype[] };
};

export interface userchatroomsubdatatype {
  subscriptionData: userchatroomsubtype;
}

export interface userchatroomprevtype {
  listUserChatrooms: userchatroomtype[];
}

// chatlist ----------------------------------------------
export interface chatlistpropstype {
  chatrooms: userchatroomtype[];
  newChat: (room: boolean) => void;
  handleActiveRoom: handleactiveroomtype;
  handleCreateChatroom: () => Promise<RESPONSETYPE>;
  setUsernameSearch: React.Dispatch<React.SetStateAction<string>>;
  setChatgroupUsers: React.Dispatch<React.SetStateAction<chatgroupusertype[]>>;
}

export interface chattertype {
  room: roomtype;
  message: string;
  users: usernametype[];
}

export interface chatprofileprops {
  chatroom: chattertype;
  handleActiveRoom: handleactiveroomtype;
}

// chatmsg --------------------------------------------
export interface chatmsgsprops {
  userId: number | null;
  roomName: string;
  chatLevel: number;
  createRoom: boolean;
  usernameSearch: string;
  error: ERRORTYPE;
  activeRoom: activeroomtype;
  chatgroupUsers: chatgroupusertype[];
  chatroomInfo: chatroominfotype;
  updateChatroomInfo: (value: ACTION) => void;
  handleActiveRoom: handleactiveroomtype;
  handleDefaultState: (def: boolean) => void;
  handleCreateChatroom: () => Promise<RESPONSETYPE>;
  setRoomName: React.Dispatch<React.SetStateAction<string>>;
  setChatLevel: React.Dispatch<React.SetStateAction<number>>;
  setError: React.Dispatch<React.SetStateAction<ERRORTYPE>>;
  setUsernameSearch: React.Dispatch<React.SetStateAction<string>>;
  setChatGroupUsers: React.Dispatch<React.SetStateAction<chatgroupusertype[]>>;
}

export interface messagestatetype {
  user_id: number;
  message: string;
  room_id: string;
  media: boolean;
}

export interface chatroomtype {
  id: number;
  owner: idstype;
  room_code: string;
  roomName: string;
  roomUsers: usernametype[];
  chatpreference: {
    about: string;
    blocked: string;
    admin: string;
    co_admin: string;
    operator: string;
    acceptor: string;
    group_profile: string;
    chatgrouptheme: string;
    allowedmedia: allowedmediatype;
  };
}

export interface messagetype {
  id: number;
  user_id: usernametype;
  room_id: roomtype;
  message: string;
  media: boolean;
  created_at: string;
}

export type chatgroupusertype = {
  id: number;
  username: string;
  profile_pic: string;
};

// messages-----------------------
export interface messageprops {
  userId: number | null;
  userInfo: usernametype;
  messageInfo: messagetype;
  activeRoom: activeroomtype;
}

export interface messagetexttype {
  txt: string;
  media: string[];
}

// chatgroupcard ------------------
export interface chatgroupcardprops {
  roomName: string;
  chatgroupUsers: chatgroupusertype[];
  setRoomName: React.Dispatch<React.SetStateAction<string>>;
  setChatgroupUsers: React.Dispatch<React.SetStateAction<chatgroupusertype[]>>;
}

//chat ---------------------
export interface chatpropstype {
  userId: number | null;
  activeRoom: activeroomtype;
  setError: React.Dispatch<React.SetStateAction<ERRORTYPE>>;
}

export interface listmessagestype {
  id: number;
  message: string;
  media: string;
  created_at: string;
  user_id: usernametype;
  room_id: { id: number; room_code: string; owner: idstype };
}

//aboutchatroom ---------------------------
export interface aboutchatroompropstype {
  userId: number;
  handleDelete: () => void;
  chatroomInfo: chatroominfotype;
  setChatLevel: React.Dispatch<React.SetStateAction<number>>;
}

//chatoptions -------------------------------
export interface chatoptionsprops {
  showChatoptions: boolean;
  handleDelete: () => void;
  setShowChatOptions: React.Dispatch<React.SetStateAction<boolean>>;
}

//chatroomsettings ---------------------------
export type roomsettingtab = "admin" | "blocked" | "requests" | "handlers";

export interface chatroomsettingprops {
  userId: number;
  usersList: chatgroupusertype[];
  chatroomPreferences: chatroominfotype;
  updateChatroomPreferences: (value: ACTION) => void;
  setError: React.Dispatch<React.SetStateAction<ERRORTYPE>>;
}

//createchatroom ------------------------------
export interface createchatroompropstype {
  roomName: string;
  createRoom: boolean;
  userId: number | null;
  usernameSearch: string;
  usersList: chatgroupusertype[];
  handleCreateChatroom: () => Promise<RESPONSETYPE>;
  chatgroupUsers: chatgroupusertype[];
  handleDefaultState: (def: boolean) => void;
  setRoomName: React.Dispatch<React.SetStateAction<string>>;
  setChatLevel: React.Dispatch<React.SetStateAction<number>>;
  setUsernameSearch: React.Dispatch<React.SetStateAction<string>>;
  setChatgroupUsers: React.Dispatch<React.SetStateAction<chatgroupusertype[]>>;
}

//chatrequest ---------------------------------------
export interface chatrequestpropstype {
  notification: notificationtype;
  handleCreateChatroom: () => Promise<RESPONSETYPE>;
  setUsernameSearch: React.Dispatch<React.SetStateAction<string>>;
  setChatgroupUsers: React.Dispatch<React.SetStateAction<chatgroupusertype[]>>;
}
