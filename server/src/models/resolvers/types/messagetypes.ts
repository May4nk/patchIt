import { usertype } from "./usertypes.js";
import { chatroomtype } from "./chatroomtypes.js";
import { IDSTYPE } from "../../../utils/common/types.js";

export interface messagetype extends IDSTYPE {
  text: string;
  user_id: usertype;
  room_id: chatroomtype;
  created_at: string;
}

export interface messagefiltertype extends IDSTYPE {
  user_id: string;
  room_id: string;
}
