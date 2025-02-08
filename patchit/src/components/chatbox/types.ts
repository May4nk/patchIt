import { navshowtype, notificationtype } from "../navbar/types";
import {
  CHATMEDIA,
  ERRORTYPE,
  IDSTYPE,
  RESPONSETYPE,
  USER_S_N_TYPE,
  usernametype,
} from "../../utils/main/types";

//chatLevels -> 100: default, 101: create chat/room, 0: chat, 1: about room, 2: room settings
export type chatlevels = 100 | 101 | 0 | 1 | 2;

export interface chatgroupusertype extends IDSTYPE {
  username: string;
  profile_pic: USER_S_N_TYPE;
}

export interface chatroominfotype {
  ownerId: string;
  about: string;
  theme: string;
  name: string;
  isRoom: boolean;
  blockedUsers: string[];
  profile_pic: string;
  users: usernametype[];
  allowedMedia: CHATMEDIA;
  admin: string;
  co_admin: string;
  operator: string;
  acceptor: string;
}

export type chatboxstatetype = {
  name: string;
  error: ERRORTYPE;
  activeRoomId: string;
  level: chatlevels;
  createRoom: boolean;
  searchUsername: string;
  roomInfo: chatroominfotype;
  roomUsers: chatgroupusertype[];
};

export type chatboxstateactiontype =
  | { type: "ADD_ROOM_USER"; user: chatgroupusertype }
  | { type: "SET_ACTIVE_ROOMINFO"; info: Partial<chatroominfotype> }
  | { type: "SEARCH_USERNAME"; username: string }
  | { type: "SET_ACTIVE_ROOMID"; roomId: string }
  | { type: "DEL_ROOM_USER"; userId: string }
  | { type: "SET_LEVEL"; level: chatlevels }
  | { type: "SET_ROOM_NAME"; name: string }
  | { type: "SET_ERROR"; error: ERRORTYPE }
  | { type: "NEW_CHAT"; isRoom: boolean }
  | { type: "RESET_ROOM_USERS" }
  | { type: "SOFT_RESET" }
  | { type: "RESET" };

export type handlechatboxstateactiontype = (
  state: chatboxstatetype,
  action: chatboxstateactiontype
) => chatboxstatetype;

export type handledefaultstatetype = (toNull: boolean) => void;
export type handleactiveroomtype = (roomId: string) => void;
export type handlecreatechatroomtype = () => Promise<RESPONSETYPE>;

export interface roomtype extends IDSTYPE {
  roomName: string;
  owner: usernametype;
}

export interface userchatroomtype extends IDSTYPE {
  room_id: roomtype;
  users: usernametype[];
  lastMessage: { message: string };
}

export interface chatboxprops {
  showChatbox: boolean;
  setShowChatbox: navshowtype;
  isNewChat: (val: number) => void;
}

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
  chatBoxState: chatboxstatetype;
  handleActiveRoom: handleactiveroomtype;
  handleChatBoxState: React.Dispatch<chatboxstateactiontype>;
  handleCreateChatroom: () => Promise<RESPONSETYPE>;
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
  userId: string;
  chatBoxState: chatboxstatetype;
  handleDefaultState: handledefaultstatetype;
  handleCreateChatroom: handlecreatechatroomtype;
  handleChatBoxState: React.Dispatch<chatboxstateactiontype>;
}

export type setchatleveltype = (level: chatlevels) => void;
export type seterrortype = (error: ERRORTYPE) => void;

export interface messagestatetype {
  user_id: string;
  room_id: string;
  media: boolean;
}

export interface chatroomtype extends IDSTYPE {
  owner: IDSTYPE;
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
    allowedmedia: CHATMEDIA;
  };
}

export interface messagetype extends IDSTYPE {
  user_id: usernametype;
  room_id: roomtype;
  text: string;
  media: boolean;
  created_at: string;
}

// messages-----------------------
export interface messageprops {
  userId: string;
  userInfo: usernametype;
  messageInfo: messagetype;
  isRoom: boolean;
}

export interface messagetexttype {
  txt: string;
  media: string[];
}

// chatgroupcard ------------------
export interface chatgroupcardprops {
  roomName: string;
  chatgroupUsers: chatgroupusertype[];
  handleChatBoxState: React.Dispatch<chatboxstateactiontype>;
}

//chat ---------------------
export interface chatpropstype {
  userId: string;
  setError: seterrortype;
  activeRoomInfo: {
    id: string;
    isRoom: boolean;
  };
}

export interface listmessagestype extends IDSTYPE {
  message: string;
  media: string;
  created_at: string;
  user_id: usernametype;
  room_id: IDSTYPE & { owner: IDSTYPE };
}

//aboutchatroom ---------------------------
export interface aboutchatroompropstype {
  userId: string;
  handleDelete: () => void;
  chatroomInfo: chatroominfotype;
  setChatLevel: setchatleveltype;
}

//chatoptions -------------------------------
export interface chatoptionsprops {
  showChatoptions: boolean;
  handleDelete: () => void;
  setShowChatOptions: React.Dispatch<React.SetStateAction<boolean>>;
}

//chatroomsettings ---------------------------
export type roomsettingtab = "admin" | "blocked" | "requests" | "handlers";

export type updatechatroompreferencestype = (
  settings: Partial<chatboxstatetype["roomInfo"]>
) => void;

export interface chatroomsettingprops {
  userId: string;
  usersList: chatgroupusertype[];
  chatroomPreferences: chatroominfotype;
  handleChatBoxState: React.Dispatch<chatboxstateactiontype>;
}

//createchatroom ------------------------------
export interface createchatroompropstype {
  userId: string;
  usersList: chatgroupusertype[];
  chatBoxState: chatboxstatetype;
  handleDefaultState: handledefaultstatetype;
  handleCreateChatroom: handlecreatechatroomtype;
  handleChatBoxState: React.Dispatch<chatboxstateactiontype>;
}

//chatrequest ---------------------------------------
export interface chatrequestpropstype {
  notification: notificationtype;
  handleChatBoxState: React.Dispatch<any>;
  handleCreateChatroom: () => Promise<RESPONSETYPE>;
}
