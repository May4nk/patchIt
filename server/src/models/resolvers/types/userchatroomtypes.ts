import { usertype } from "./usertypes.js";
import { chatroomtype } from "./chatroomtypes.js";

export interface userchatroomtype {
  id: number;  
  room_id: chatroomtype;
  user_id: usertype;
  status: string;
  created_at: string;
}

export interface userchatroomfiltertype {
  room_id: string;
  user_id: number;
  status: string;
}

