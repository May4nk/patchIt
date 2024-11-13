import { userchatroomtype } from "../../resolvers/types/userchatroomtypes.js";

export type ruserchatroomtype = {
  id: number;
};

export interface userchatroomdatatype {
  data: userchatroomtype[];
}

export interface remuserchatroomdatatype {
  data: ruserchatroomtype;
}

export interface rawuserchatroomtype {
  id: number;
  room_id: number;
  user_id: number;
  status: string;
  created_at: string;
}
