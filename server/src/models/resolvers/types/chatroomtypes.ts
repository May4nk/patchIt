import { STATUS } from "../../../utils/common/types";
import { usertype } from "./usertypes";

export interface chatroomfiltertype {
  id: number;
  room_code: string;
  owner: number;
  status: STATUS;
  roomName: string;
}

export interface chatroomtype {
  id: number;
  room_code: string;
  owner: usertype;
  roomName: string;
  status: STATUS;
  created_at: string;
}
