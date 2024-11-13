import { STATUS } from "../../../utils/common/types";

export type rchatroomtype = {
  id: number;
};

interface chatroomtype {
  id: number;
  room_code: string;
  owner: number;
  status: STATUS;
  roomName: string;
  created_at: string;
}

export interface chatroomdatatype {
  data: chatroomtype;
}

export interface remchatroomdatatype {
  data: rchatroomtype;
}
