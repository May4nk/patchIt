export interface roomtype {
  id: number;
  room_code: string;
}

export interface usertype {
  id: number;
  email: string;
  username: string;
  profile_pic: string;
}

export interface userchatroomtype {
  id: number;
  room_id: roomtype;
  user_id: usertype;
  users: usertype[];
  lastMessage: { message: string };
}

export interface chatboxprops {
  showChatbox: boolean;
  setShowChatbox: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface activeroomtype {
  username: string;
  roomId: string;
}

interface subdatatype {
  newUserChatroom: userchatroomtype[];
}

interface userchatroomsubtype {
  data: subdatatype;
}

export interface userchatroomsubscriptiondatatype {
  subscriptionData: userchatroomsubtype;
}

export interface userchatroomprevtype {
  listUserChatrooms: userchatroomtype[];
}

// chatlist ----------------------------------------------
export interface chatlistprops {
  activeRoom: activeroomtype;
  chatrooms: userchatroomtype[];
  handleActiveRoom: (name: string, room: activeroomtype) => void;
  createRoom: boolean;
  handleNew: (room: boolean) => void;
}

export interface chatprofileprops {
  handleActiveRoom: (name: string, room: activeroomtype) => void;
  chatroom: chattertype;
}

export interface chattertype {
  users: usertype[];
  room: { id: number; room_code: string };
  message: string;
}

// chatmsg --------------------------------------------
export interface chatmsgsprops {
  userId: number | null;
  chatLevel: number;
  chatrooms: userchatroomtype[];
  setChatLevel: React.Dispatch<React.SetStateAction<number>>;
  activeRoom: activeroomtype;
  setActiveRoom: React.Dispatch<React.SetStateAction<activeroomtype>>;
  handleActiveRoom: (name: string, room: activeroomtype) => void;
  createRoom: boolean;
  setCreateRoom: React.Dispatch<React.SetStateAction<boolean>>;
  setShowChatbox: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface messagestatetype {
  user_id: number;
  message: string;
  room_id: string;
}

export interface messagetype {
  id: number;
  user_id: usertype;
  room_id: roomtype;
  message: string;
  created_at: string;
}

export type chatgroupusertype = { id: number; username: string };
