export interface roomtype {
  id: string;
  room_code: string;
}

interface usertype {
  id: string;
  email: string;
  profile_pic: string;
  username: string;
}

export interface userchatroomtype {
  id: string;
  room_id: roomtype|number;
  user_id: usertype|number;
}

export interface chatboxprops {
  showChatbox : boolean;
  setShowChatbox: any;
}

export interface activeroomtype {
  username: string;
  roomId: string;
}

interface subdatatype {
  newUserChatroom: userchatroomtype[];
}

interface userchatroomsubtype {
  data: subdatatype
}

export interface userchatroomsubscriptiondatatype {
  subscriptionData: userchatroomsubtype;
}

export interface userchatroomprevtype {
  listSpecificUserChatrooms: userchatroomtype[];
}

// chatlist ----------------------------------------------

export interface chatlistprops {
  activeRoom: any;
  chatrooms: any;
  handleActiveRoom: any;
  createRoom: any;
  handleNew: any;
}

export interface chatprofileprops {
  handleActiveRoom: any;
  chatroom: any;
}

// chatmsg --------------------------------------------

export interface chatmsgsprops {
  userId: number|null;
  chatLevel: any;
  setChatLevel: any;
  activeRoom: any;
  setActiveRoom: any;
  handleActiveRoom: any;
  createRoom: any;
  setCreateRoom: any;
  setShowChatbox: any;
}

export interface message {
  user_id: number;
  message: string;
  room_id: string;
}

export type chatgroupusertype = { id: number, username: string };
