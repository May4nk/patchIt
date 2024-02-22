import { usertype }  from "./usertypes.js";
import { chatroomtype } from "./chatroomtypes.js";

export interface messagetype {
  id: number;
  user_id: usertype;
  message: string;
  room_id: chatroomtype;
  created_at: string;
}

export interface messagefiltertype {
  id: number;
  user_id: number;
  room_id: string;
}
