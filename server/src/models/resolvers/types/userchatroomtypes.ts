import { usertype } from "./usertypes.js";
import { chatroomtype } from "./chatroomtypes.js";
import { IDSTYPE, STATUS } from "../../../utils/common/types.js";

export interface userchatroomtype extends IDSTYPE {
  room_id: chatroomtype;
  user_id: usertype;
  status: STATUS;
  created_at: string;
}

export interface userchatroomfiltertype {
  room_id: string;
  user_id: string;
  status: STATUS;
}

export interface rawuserchatroomtype extends userchatroomfiltertype, IDSTYPE {
  created_at: string;
}
