import { IDSTYPE, STATUS } from "../../../utils/common/types";
import { usertype } from "./usertypes";

export interface chatroomtype extends IDSTYPE {
  owner: usertype;
  roomName: string;
  status: STATUS;
  created_at: string;
}

export interface chatroomfiltertype extends IDSTYPE {
  owner: string;
  status: STATUS;
  roomName: string[];
}

export interface chatroommutetype extends chatroomfiltertype {
  created_at: string;
}

export interface chatroomexisttype {
  roomName: string;
}
